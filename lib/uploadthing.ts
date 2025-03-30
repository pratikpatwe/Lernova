import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  streamAttachment: f({
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "4MB" },
    text: { maxFileSize: "1MB" },
    // Make sure to include both modern and legacy formats with proper MIME types
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": { maxFileSize: "8MB" }, // .pptx
    "application/vnd.ms-powerpoint": { maxFileSize: "8MB" }, // .ppt
    // Add additional PowerPoint-related MIME types for better compatibility
    "application/powerpoint": { maxFileSize: "8MB" },
    "application/mspowerpoint": { maxFileSize: "8MB" },
    "application/x-mspowerpoint": { maxFileSize: "8MB" },
    // Word files
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "8MB" }, // .docx
    "application/msword": { maxFileSize: "8MB" } // .doc
  })
    .middleware(async ({ req }) => {
      // You might want to properly authenticate the user here
      // This is just a placeholder - you should use your actual auth logic
      const userId = req.headers.get("x-userid") || "anonymous";

      // Return metadata you want to access in onUploadComplete
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      return { uploadedBy: metadata.userId, url: file.url, key: file.key };
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter