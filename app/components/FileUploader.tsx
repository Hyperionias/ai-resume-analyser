import {useCallback, useState} from "react";
import {useDropzone} from "react-dropzone";

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}


const FileUploader = ({onFileSelect} : FileUploaderProps) => {

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;

        if (onFileSelect) {
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        maxSize: 20 * 1024 * 1024, // 20MB
        multiple: false
    })

    const file = acceptedFiles[0] || null;

    

    return (
        <div className="w-full">
            <div 
                {...getRootProps()} 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-indigo-500 transition-colors cursor-pointer bg-white"
            >
                <input {...getInputProps()} />

                <div className="space-y-4 text-center">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center">
                        <img src="/icons/info.svg" alt="upload" className="size-20"/>
                    </div>

                    {file ? (
                        <div className="text-center py-4">
                            <p className="text-lg font-semibold text-green-600 mb-2">✓ File uploaded</p>
                            <p className="text-sm text-gray-700 font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            <p className="text-xs text-indigo-500 mt-3">Click to change file</p>
                        </div>
                    ): (
                        <div className="text-center py-4">
                            <p className="text-base text-gray-600 mb-2">
                                <span className="font-semibold text-indigo-600">
                                    Click to upload
                                </span>
                                <span className="text-gray-500"> or drag and drop</span>
                            </p>
                            <p className="text-sm text-gray-500">PDF files only (max 20 MB)</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FileUploader