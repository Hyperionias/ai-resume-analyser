import Navbar from "~/components/Navbar";
import {type FormEvent, useState} from "react";
import FileUploader from "~/components/FileUploader";

const Upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const form = e.currentTarget.closest('form');
        if (!form) return;
        
        const formData = new FormData(form);
        
        // Form verilerini kontrol et
        const companyName = formData.get('company-name');
        const jobTitle = formData.get('job-title');
        const jobDescription = formData.get('job-description');
        
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
        
        // İşlemi başlat
        setIsProcessing(true);
        setStatusText('Analyzing your resume...');
        
        // Burada Puter API'ye göndereceğiz (şimdilik simüle edelim)
        console.log('Form Data:', {
            companyName,
            jobTitle,
            jobDescription,
            file: file.name
        });
        
        // TODO: Puter AI ile analiz yap
    };

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };
    return(
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className={"main-section"}>
                <div className={"page-heading py-16"}>
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className={"w-full"} />
                        </>
                    ):(
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
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