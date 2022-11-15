// import { useState } from "react";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Widget } from "@uploadcare/react-widget";

function ImageForm({ projectName }) {
  const { authState } = useAuth();

  useEffect(() => console.log(authState), [authState]);

  return (
    <section>
      <p>
        <label htmlFor="file">Your file:</label>{" "}
        <Widget
          publicKey="a8a3d493f7784d19923f"
          id="file"
          imagesOnly="true"
          previewStep="true"
          multiple="true"
          imageShrink="800X600"
          metadata={JSON.stringify({
            userId: authState.userId,
            projectId: projectName,
          })}
          onFileSelect={(file) => {
            // console.log(metadata);
            console.log("File changed: ", file);

            // if (files) {
            //   //   files.progress((info) => console.log("File progress: ", info));
            //   //   files.files((info) =>
            //   //     console.log("File uploaded: ", info.metadata)
            //   //   );
            // }
          }}
          onChange={(info) => console.log("Upload completed:", info)}
        />
      </p>
    </section>
  );
}

export default ImageForm;
