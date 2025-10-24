import React from "react";
import { useDropzone } from "react-dropzone";

export default function FileUploader({ onFile }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: (accepted) => {
      if (accepted && accepted[0]) onFile(accepted[0]);
    }
  });

  return (
    <div {...getRootProps()} className="border-dashed border-2 border-gray-300 p-4 rounded-md text-center cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <p className="text-sm">Drag & drop salary slip here, or click to upload</p>
      )}
    </div>
  );
}
