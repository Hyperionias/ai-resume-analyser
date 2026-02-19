import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if(!auth.isAuthenticated) {
      navigate('/auth?next=/');
    }
  }, [auth.isAuthenticated, navigate])

  useEffect(() => {
    const fetchResumes = async () => {
      if (!auth.isAuthenticated) return;

      try {
        // Resume listesini çek
        const resumeListData = await kv.get('resume-list');
        
        if (!resumeListData || typeof resumeListData !== 'string') {
          setResumes([]);
          setIsLoading(false);
          return;
        }

        const resumeIds: string[] = JSON.parse(resumeListData);
        
        // Her resume'nin detayını çek
        const resumePromises = resumeIds.map(async (id) => {
          try {
            const resumeData = await kv.get(`resume:${id}`);
            if (resumeData && typeof resumeData === 'string') {
              return JSON.parse(resumeData) as Resume;
            }
            return null;
          } catch (err) {
            console.error(`Error fetching resume ${id}:`, err);
            return null;
          }
        });

        const fetchedResumes = await Promise.all(resumePromises);
        const validResumes = fetchedResumes.filter((r): r is Resume => r !== null);
        
        setResumes(validResumes);
      } catch (err) {
        console.error('Error fetching resumes:', err);
        setResumes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, [auth.isAuthenticated, kv]);

  if (isLoading) {
    return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar />
        <section className="main-section">
          <div className="page-heading py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="text-lg text-gray-600">Loading your resumes...</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className={"main-section"}>
      <div className={"page-heading py-16"}>
        <h1>Track Your Applications & Resume Ratings</h1>
        <h2>Review your submissions and check AI-powered feedback.</h2>
      </div>
    </section>

    {resumes.length > 0 ? (
      <div className="resumes-section">
        {resumes.map((resume) => (
          <ResumeCard key={resume.id} resume={resume} />
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center gap-6 py-12">
        <div className="text-center max-w-md">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Resumes Yet</h3>
          <p className="text-gray-500 mb-6">Upload your first resume to get AI-powered feedback and improve your chances!</p>
          <button
            onClick={() => navigate('/upload')}
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-full transition-colors"
          >
            Upload Your First Resume
          </button>
        </div>
      </div>
    )}
  </main>;
}
