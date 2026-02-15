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
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center">
                        <img src="/icons/info.svg" alt="upload" className="size-20"/>
                    </div>

                    {file ? (
                        <div className="text-center">
                            <p className="text-lg font-semibold text-green-600">✓ File uploaded</p>
                            <p className="text-sm text-gray-600">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    ): (
                        <div>
                            <p className="text-lg text-gray-500">
                                <span className="font-semibold">
                                    Click to upload
                                </span> or drag and drop
                            </p>
                            <p className="text-lg text-gray-500">PDF (max 20 MB)</p>
                        </div>

                    )}
                </div>
            </div>
        </div>
    )
}

export default FileUploader