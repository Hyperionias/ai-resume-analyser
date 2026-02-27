import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import Navbar from "~/components/Navbar";
import ScoreCircle from "~/components/ScoreCircle";
import { usePuterStore } from "~/lib/puter";

export const meta = () => ([
    { title: 'Resumind | Results' },
    { name: 'description', content: 'Your AI-powered resume analysis results' },
]);

const SECTION_LABELS: Record<string, string> = {
    ATS: 'ATS Compatibility',
    toneAndStyle: 'Tone & Style',
    content: 'Content',
    structure: 'Structure',
    skills: 'Skills',
};

const SECTION_KEYS = ['ATS', 'toneAndStyle', 'content', 'structure', 'skills'] as const;

const ScoreBar = ({ score }: { score: number }) => {
    const color =
        score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';

    return (
        <div className="flex items-center gap-3 w-full">
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${score}%`, backgroundColor: color }}
                />
            </div>
            <span className="text-sm font-semibold w-12 text-right" style={{ color }}>
                {score}/100
            </span>
        </div>
    );
};

const TipItem = ({ tip }: { tip: Tip }) => (
    <div className={`flex items-start gap-3 p-3 rounded-xl ${tip.type === 'good' ? 'bg-green-50' : 'bg-amber-50'}`}>
        <span className="text-lg mt-0.5 flex-shrink-0">
            {tip.type === 'good' ? '✅' : '💡'}
        </span>
        <div>
            <p className={`text-sm font-medium ${tip.type === 'good' ? 'text-green-800' : 'text-amber-800'}`}>
                {tip.tip}
            </p>
            {tip.explanation && (
                <p className="text-xs text-gray-500 mt-1">{tip.explanation}</p>
            )}
        </div>
    </div>
);

const SectionCard = ({
    label,
    section,
}: {
    label: string;
    section: Section;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                onClick={() => setOpen((o) => !o)}
            >
                <div className="flex items-center gap-4 flex-1">
                    <span className="font-semibold text-gray-800 text-left">{label}</span>
                    <div className="flex-1 max-w-xs hidden sm:block">
                        <ScoreBar score={section.score} />
                    </div>
                </div>
                <span className="text-gray-400 ml-4 text-lg">{open ? '▲' : '▼'}</span>
            </button>

            {/* Mobile score bar */}
            <div className="px-6 pb-2 sm:hidden">
                <ScoreBar score={section.score} />
            </div>

            {open && (
                <div className="px-6 pb-5 flex flex-col gap-2 border-t border-gray-50 pt-4">
                    {section.tips.map((tip, i) => (
                        <TipItem key={i} tip={tip} />
                    ))}
                </div>
            )}
        </div>
    );
};

const Results = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { auth, kv, fs } = usePuterStore();
    const [resume, setResume] = useState<Resume | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate(`/auth?next=/results/${id}`);
        }
    }, [auth.isAuthenticated, id, navigate]);

    useEffect(() => {
        const loadResume = async () => {
            if (!auth.isAuthenticated || !id) return;

            try {
                const data = await kv.get(`resume:${id}`);
                if (!data || typeof data !== 'string') {
                    setError('Resume not found. It may have been deleted.');
                } else {
                    setResume(JSON.parse(data) as Resume);
                }
            } catch (err) {
                setError('Failed to load resume data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadResume();
    }, [auth.isAuthenticated, id, kv]);

    // Load image from Puter FS as blob URL
    useEffect(() => {
        if (!resume?.imagePath) return;
        let objectUrl: string | null = null;

        // Normalize path: strip /puter-files/ prefix if present (old format)
        const puterPath = resume.imagePath.replace(/^\/puter-files\//, '');

        fs.read(puterPath).then((blob) => {
            if (blob) {
                objectUrl = URL.createObjectURL(blob);
                setImageUrl(objectUrl);
            }
        }).catch(console.error);
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [resume?.imagePath, fs]);

    if (isLoading) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-indigo-600" />
                        <p className="text-gray-500 font-medium">Loading your results…</p>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !resume) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
                    <div className="text-6xl">😕</div>
                    <h1 className="text-2xl font-bold text-gray-700 text-center">
                        {error || 'Resume not found'}
                    </h1>
                    <Link
                        to="/"
                        className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-full transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </main>
        );
    }

    const { feedback, companyName, jobTitle, imagePath } = resume;

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="max-w-6xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/" className="text-indigo-500 hover:text-indigo-700 text-sm font-medium">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800 mt-3">{companyName}</h1>
                    <p className="text-gray-500 text-lg">{jobTitle}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Resume image + Overall score */}
                    <div className="flex flex-col gap-6">
                        {/* Overall score card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-6">
                            <ScoreCircle score={feedback.overallScore} />
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Overall Score</p>
                                <p className="text-4xl font-bold text-gray-800">
                                    {feedback.overallScore}
                                    <span className="text-xl text-gray-400 font-normal">/100</span>
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {feedback.overallScore >= 75
                                        ? '🎉 Great resume!'
                                        : feedback.overallScore >= 50
                                            ? '👍 Good start, room to improve'
                                            : '📝 Needs significant improvements'}
                                </p>
                            </div>
                        </div>

                        {/* Resume thumbnail */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="Resume preview"
                                    className="w-full object-cover object-top"
                                    style={{ maxHeight: '480px' }}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                                    Loading preview…
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Section breakdowns */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-gray-800">Detailed Feedback</h2>
                        {SECTION_KEYS.map((key) => (
                            <SectionCard
                                key={key}
                                label={SECTION_LABELS[key]}
                                section={feedback[key]}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Results;
