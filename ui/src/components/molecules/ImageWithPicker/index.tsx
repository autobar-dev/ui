import { useStyles } from "./styles";
import { Button, Code, FileInput, Image, Loader, Modal, UnstyledButton } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react";
import UserContext from "../../../contexts/UserContext";
import { IconEdit } from "@tabler/icons";
import { FileContent, useFilePicker } from "use-file-picker";
import ReactCrop, { Crop } from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css'
import { showNotification } from "@mantine/notifications";

interface ImageWithPickerProps {
  className?: string;
  src?: string;
  placeholder?: string;
}

export default function ImageWithPicker(props: ImageWithPickerProps) {
  const { classes } = useStyles();
  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: "DataURL",
    accept: ["image/jpg", "image/jpeg", "image/png"],
    multiple: false,
  });
  const [selectedFile, setSelectedFile] = useState<FileContent>();
  const [modalOpened, setModalOpened] = useState(false);
  const [imageCrop, setImageCrop] = useState<Crop>();
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  useEffect(() => {
    if(filesContent.length == 1) {
      setSelectedFile(filesContent[0]);
      setImageCrop(undefined);
      setModalOpened(true);
    }
  }, [filesContent]);

  return (
    <>
      <div className={[classes.wrapper, props.className || ""].join(" ")}>
        { props.src ? (
          <img
            src={props.src}
            alt="Profile Picture"
            className={classes.image}
          />
        ) : (
          <div className={classes.placeholder}>
            <span className={classes.placeholderText}>
              { props.placeholder || "NA" }
            </span>
          </div>
        )}

        <UnstyledButton
          className={classes.picker}
          onClick={openFileSelector}
        >
          <IconEdit
            color="#e3b04b"
            size={32}
          />
        </UnstyledButton>
      </div>
      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setImageCrop(undefined);
          setSelectedFile(undefined);
        }}
        title="Crop image"
      >
        <div className={classes.modalContent}>
          <ReactCrop
            crop={imageCrop}
            onChange={(newCrop, newPercentCrop) => setImageCrop(newPercentCrop)}
            aspect={1}
            circularCrop={true}
          >
            <img
              src={selectedFile ? selectedFile.content : ""}
              alt="New profile picture"
              className={classes.modalImage}
            />
          </ReactCrop>
          <Button
            onClick={async () => {
              try {
                setImageUploadLoading(true);

                const imageBlob = await (await fetch(selectedFile?.content || "")).blob();
                const imageFile = new File([imageBlob], "profile_picture.jpg", { type: "image/jpeg" });

                const x = imageCrop?.x ?? -1;
                const y = imageCrop?.y ?? -1;
                const width = imageCrop?.width ?? -1;
                const height = imageCrop?.height ?? -1;

                const formData = new FormData();
                formData.append("image", imageFile);
                formData.append("x", x.toString());
                formData.append("y", y.toString());
                formData.append("width", width.toString());
                formData.append("height", height.toString());

                const response = await fetch("/api/process/upload-profile-picture", {
                  method: "POST",
                  body: formData,
                });

                if(response.status == 200) {
                  showNotification({
                    title: "Success",
                    message: "Profile picture updated successfully. Refresh the page to see changes.",
                    color: "green",
                  });
                } else {
                  showNotification({
                    title: "Error",
                    message: "An error occurred while updating profile picture.",
                    color: "red",
                  });
                }
              } catch(e) {
                showNotification({
                  title: "Error",
                  message: "An error occurred while updating profile picture.",
                  color: "red",
                });
              }

              setImageUploadLoading(false);
              setModalOpened(false);
              setSelectedFile(undefined);
            }}
            className={classes.modalButton}
            disabled={!imageCrop || imageUploadLoading}
          >
            { imageUploadLoading ? 
                <Loader
                  color="#fff"
                  size="sm"
                />
              :
                "Save"
            }
          </Button>
        </div>
      </Modal>
    </>
  );
}