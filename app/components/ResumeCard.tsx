import { Link } from "react-router";
import { useEffect, useState } from "react";
import ScoreCircle from "~/components/ScoreCircle";
import { usePuterStore } from "~/lib/puter";

interface ResumeCardProps {
    resume: Resume;
    onDelete?: (id: string) => void;
}

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath }, onDelete }: ResumeCardProps) => {
    const { fs } = usePuterStore();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!imagePath) return;
        let objectUrl: string | null = null;
        const puterPath = imagePath.replace(/^\/puter-files\//, '');
        fs.read(puterPath).then((blob) => {
            if (blob) {
                objectUrl = URL.createObjectURL(blob);
                setImageUrl(objectUrl);
            }
        }).catch(() => {/* silently ignore missing images */ });
        return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
    }, [imagePath, fs]);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Delete this resume analysis?')) return;
        setIsDeleting(true);
        onDelete?.(id);
    };

    return (
        <Link
            to={`/resume/${id}`}
            className={`resume-card animate-in fade-in duration-1000 relative ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}
        >
            {/* Delete button */}
            {onDelete && (
                <button
                    onClick={handleDelete}
                    className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-colors text-sm"
                    title="Delete"
                >
                    ✕
                </button>
            )}

            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    <h2 className="!text-black font-bold break-words pr-8">{companyName}</h2>
                    <h3 className="!text-lg break-words text-gray-500">{jobTitle}</h3>
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>

            <div className="gradient-border animate-in fade-in duration-1000">
                <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="resume"
                            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                        />
                    ) : (
                        <div className="w-full h-[350px] max-sm:h-[200px] flex items-center justify-center text-gray-300 text-sm">
                            No preview
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ResumeCard;
