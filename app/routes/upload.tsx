import Navbar from "~/components/Navbar";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";

const Upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { ai, fs, kv } = usePuterStore();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const form = e.currentTarget.closest('form');
        if (!form) return;

        const formData = new FormData(form);

        // Form verilerini kontrol et
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        // Dosya kontrolü
        if (!file) {
            alert('Please upload a resume file');
            return;
        }

        // Tüm alanlar dolu mu kontrol et
        if (!companyName || !jobTitle || !jobDescription) {
            alert('Please fill all fields');
            return;
        }

        try {
            // İşlemi başlat
            setIsProcessing(true);
            setStatusText('Step 1/5: Converting PDF to image...');

            // 1. PDF'i PNG'ye çevir
            const conversionResult = await convertPdfToImage(file);
            if (conversionResult.error || !conversionResult.file || !conversionResult.dataUrl) {
                throw new Error(conversionResult.error || 'Failed to convert PDF to image');
            }

            setStatusText('Step 2/5: Uploading files to cloud...');

            // 2. Resume ID oluştur
            const resumeId = generateUUID();

            // 3. PDF dosyasını Puter'a yükle (kök dizine)
            const pdfPath = `${resumeId}.pdf`;
            await fs.write(pdfPath, file);

            // 4. PNG görüntüsünü Puter'a yükle (kök dizine)
            const imagePath = `${resumeId}.png`;
            await fs.write(imagePath, conversionResult.file);

            setStatusText('Step 3/5: Analyzing resume with AI (this may take ~30 seconds)...');

            // 5. AI Prompt oluştur
            const prompt = `You are an expert resume analyzer. Analyze this resume for a ${jobTitle} position at ${companyName}.

Job Description:
${jobDescription}

Provide detailed feedback in the following JSON format (respond ONLY with valid JSON, no other text):

{
  "overallScore": <number 0-100>,
  "ATS": {
    "score": <number 0-100>,
    "tips": [
      {"type": "good" or "improve", "tip": "tip text"}
    ]
  },
  "toneAndStyle": {
    "score": <number 0-100>,
    "tips": [
      {"type": "good" or "improve", "tip": "tip text", "explanation": "explanation text"}
    ]
  },
  "content": {
    "score": <number 0-100>,
    "tips": [
      {"type": "good" or "improve", "tip": "tip text", "explanation": "explanation text"}
    ]
  },
  "structure": {
    "score": <number 0-100>,
    "tips": [
      {"type": "good" or "improve", "tip": "tip text", "explanation": "explanation text"}
    ]
  },
  "skills": {
    "score": <number 0-100>,
    "tips": [
      {"type": "good" or "improve", "tip": "tip text", "explanation": "explanation text"}
    ]
  }
}

Analyze the resume carefully and provide constructive, specific feedback.`;

            // 6. Puter AI'ye gönder (img2txt → chat iki adımlı analiz)
            const aiResponse = await ai.feedback(conversionResult.file, prompt);

            if (!aiResponse) {
                throw new Error('AI returned no response. Check your Puter account credits or try again.');
            }

            // Puter returns OpenAI-compatible format: response.message.content
            // Fall back to response.content for other formats
            const rawContent = (aiResponse as any).message?.content ?? aiResponse.content;

            if (!rawContent) {
                throw new Error('AI response had no content: ' + JSON.stringify(aiResponse));
            }

            setStatusText('Step 4/5: Processing AI feedback...');

            // 7. AI yanıtını parse et
            let feedbackText = '';
            if (Array.isArray(rawContent)) {
                feedbackText = rawContent
                    .filter((item: any) => item.type === 'text')
                    .map((item: any) => item.text)
                    .join('');
            } else if (typeof rawContent === 'string') {
                feedbackText = rawContent;
            }

            // JSON'u temizle (markdown kod blokları varsa)
            feedbackText = feedbackText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            const feedback: Feedback = JSON.parse(feedbackText);

            setStatusText('Saving results...');

            // 8. Resume objesini oluştur
            const resume: Resume = {
                id: resumeId,
                companyName,
                jobTitle,
                imagePath: imagePath,      // raw Puter path: uuid.png
                resumePath: pdfPath,       // raw Puter path: uuid.pdf
                feedback
            };

            // 9. Puter KV'ye kaydet
            await kv.set(`resume:${resumeId}`, JSON.stringify(resume));

            // 10. Resume listesini güncelle
            const resumeListData = await kv.get('resume-list');
            const resumeList: string[] = resumeListData ? JSON.parse(resumeListData as string) : [];
            resumeList.unshift(resumeId); // En başa ekle
            await kv.set('resume-list', JSON.stringify(resumeList));

            setStatusText('Complete! Redirecting...');

            // 11. Results sayfasına yönlendir
            setTimeout(() => {
                navigate(`/results/${resumeId}`);
            }, 1000);

        } catch (err) {
            console.error('Upload error:', err);
            let message = 'An error occurred during analysis';
            if (err instanceof Error) {
                message = err.message;
            } else if (typeof err === 'string') {
                message = err;
            } else if (err && typeof err === 'object') {
                message = JSON.stringify(err);
            }
            setError(message);
            setIsProcessing(false);
            setStatusText('');
        }
    };

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className={"main-section"}>
                <div className={"page-heading py-16"}>
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className={"w-full"} alt="Processing" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl">
                            <p className="text-red-600 font-semibold">Error:</p>
                            <p className="text-red-500 text-sm">{error}</p>
                            <button
                                onClick={() => {
                                    setError(null);
                                    setIsProcessing(false);
                                }}
                                className="mt-2 text-sm text-red-600 underline"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name"></input>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title"></input>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description"></textarea>
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                                {file && (
                                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm font-semibold text-green-700">Selected file:</p>
                                        <p className="text-sm text-gray-700">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                )}
                            </div>
                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>

                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
