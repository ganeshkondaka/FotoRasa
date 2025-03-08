import { useRef, useState } from "react";
import domtoimage from "dom-to-image";
import Addsunglasses from "./Addsunglasses";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";

export default function Bg_remover() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imgsrc, setimgsrc] = useState(null);

  const divref = useRef(null);
  const imgref = useRef(null);

  const Divtoimg = async () => {
    if (!divref.current) return;

    // Apply grayscale effect before capture
    imgref.current.style.filter = "grayscale(100%)";

    domtoimage.toPng(divref.current)
      .then((dataUrl) => {
        setimgsrc(dataUrl);
        const link = document.createElement("a");
        link.href = dataUrl;
      })
      .catch((error) => {
        console.error("Error capturing div:", error);
      });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const removeBackground = async () => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = async () => {
        try {
          setLoading(true);
          const net = await bodyPix.load();
          const segmentation = await net.segmentPerson(img);

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 4) {
            if (segmentation.data[i / 4] === 0) {
              data[i + 3] = 0; // Set alpha to 0 for background pixels
            }
          }

          ctx.putImageData(imageData, 0, 0);
          const outputDataUrl = canvas.toDataURL();
          setOutputImage(outputDataUrl);
        } catch (error) {
          console.error("Error removing background:", error);
          alert("Failed to remove background. Check the console for details.");
        } finally {
          setLoading(false);
        }
      };
    };
    reader.readAsDataURL(selectedImage);
  };

  return (
    <div className="flex flex-col w-full items-center justify-center p-5 gap-5">
      <div className="bg-red-500 p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Remove Background from Image</h2>

        <input type="file" accept="image/*" onChange={handleImageChange} className="mb-3" />

        <div>
          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="w-64 h-auto border p-2 mb-3 rounded-lg"
              style={{ filter: "grayscale(100%)" }}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={removeBackground}
          className="bg-blue-500 border border-zinc-600 text-white px-4 py-2 rounded-md mb-4"
          disabled={loading}
        >
          {loading ? "Processing..." : "Remove Background"}
        </button>

        <div ref={divref} className="w-96">
          {outputImage && (
            <div className="relative w-96 h-96 bg-red-600">
              <div className="text-center flex flex-col items-center absolute w-96 h-96 bg-red-600">
                <p className="leading-[0.6] text-9xl font-extrabold text-yellow-400 opacity-100">war</p>
                <p className="leading-[0.6] text-[150px] font-extrabold text-yellow-400 opacity-80">war</p>
                <p className="leading-[0.6] text-[200px] font-extrabold text-yellow-400 opacity-60">war</p>
              </div>
              <img ref={imgref} src={outputImage}
                style={{ filter: "grayscale(100%)" }}
                alt="Output" className="w-96 h-96 object-cover contrast-150 brightness-100 grayscale absolute" />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={Divtoimg}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Download as Image
      </button>
      {imgsrc && <Addsunglasses imgsrc={imgsrc} />}
    </div>
  );
}










// import { useRef, useState } from "react";
// import axios from "axios";
// import domtoimage from "dom-to-image";
// import Addsunglasses from "./Addsunglasses";

// export default function Bg_remover() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [outputImage, setOutputImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [imgsrc, setimgsrc] = useState(null);

//   const divref = useRef(null);
//   const imgref = useRef(null);

//   const Divtoimg = async () => {
//     if (!divref.current) return;

//     // Apply grayscale effect before capture
//     imgref.current.style.filter = "grayscale(100%)";

//     domtoimage.toPng(divref.current)
//       .then((dataUrl) => {
//         // console.log('dataUrl:', dataUrl);
//         setimgsrc(dataUrl);
//         const link = document.createElement("a");
//         link.href = dataUrl;
//         // link.download = "captured-div.png";
//         // link.click();
//       })
//       .catch((error) => {
//         console.error("Error capturing div:", error);
//       });
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSelectedImage(file);
//     }
//   };

//   // const removeBackground = async () => {
//   //   if (!selectedImage) {
//   //     alert("Please select an image first!");
//   //     return;
//   //   }

//   //   const apiKey = import.meta.env.VITE_API_key; // Replace with your API key
//   //   const formData = new FormData();
//   //   formData.append("image_file", selectedImage);
//   //   formData.append("size", "auto");

//   //   try {
//   //     setLoading(true);
//   //     const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
//   //       headers: {
//   //         "X-Api-Key": apiKey,
//   //       },
//   //       responseType: "blob",
//   //     });

//   //     const imageUrl = URL.createObjectURL(response.data);
//   //     setOutputImage(imageUrl);

      
//   //   } catch (error) {
//   //     console.error("Error removing background:", error);
//   //     alert("Failed to remove background. Check the console for details.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // ...existing code...

// const removeBackground = async () => {
//   if (!selectedImage) {
//     alert("Please select an image first!");
//     return;
//   }

//   const apiKey = import.meta.env.VITE_API_key; // Replace with your API key
//   const formData = new FormData();

//   // Draw pattern on the image before sending it to the API
//   const reader = new FileReader();
//   reader.onload = (event) => {
//     const img = new Image();
//     img.src = event.target.result;
//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");

//       canvas.width = img.width;
//       canvas.height = img.height;

//       ctx.drawImage(img, 0, 0);

//       // Draw pattern on top of the image
//       ctx.fillStyle = "transparent"; // White pattern with 50% opacity
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Black pattern with 10% opacity
//       for (let i = 0; i < canvas.width; i += 10) {
//         for (let j = 0; j < canvas.height; j += 10) {
//           ctx.fillRect(i, j, 5, 5);
//         }
//       }

//       canvas.toBlob(async (blob) => {
//         formData.append("image_file", blob);
//         formData.append("size", "auto");

//         // Proceed with the API call
//         try {
//           setLoading(true);
//           const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
//             headers: {
//               "X-Api-Key": apiKey,
//             },
//             responseType: "blob",
//           });

//           const imageUrl = URL.createObjectURL(response.data);
//           setOutputImage(imageUrl);
//         } catch (error) {
//           console.error("Error removing background:", error);
//           alert("Failed to remove background. Check the console for details.");
//         } finally {
//           setLoading(false);
//         }
//       }, "image/png");
//     };
//   };
//   reader.readAsDataURL(selectedImage);
// };

// // ...existing code...

//   return (
//     <div className="flex flex-col w-full items-center justify-center p-5 gap-5">
//       <div className="bg-red-500 p-4 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold mb-4 text-white">Remove Background from Image</h2>

//         <input type="file" accept="image/*" onChange={handleImageChange} className="mb-3" />

//         <div>
//           {selectedImage && (
//             <img
//               src={URL.createObjectURL(selectedImage)}
//               alt="Selected"
//               className="w-64 h-auto border p-2 mb-3 rounded-lg"
//               style={{ filter: "grayscale(100%)" }}
//             />
//           )}
//         </div>
//       </div>

//       <div className="flex flex-col items-center">
//         <button
//           onClick={removeBackground}
//           className="bg-blue-500 border border-zinc-600 text-white px-4 py-2 rounded-md mb-4"
//           disabled={loading}
//         >
//           {loading ? "Processing..." : "Remove Background"}
//         </button>

//         <div ref={divref} className="w-96">
//           {outputImage && (
//              <div ref={divref} className="w-96">
//              {outputImage && (
//                  <div className=" relative w-96  h-96 bg-red-600  ">
//                      <div className="text-center flex flex-col items-center absolute w-96 h-96 bg-red-600">
//                          <p className="leading-[0.6] text-9xl font-extrabold text-yellow-400 opacity-100 ">war</p>
//                          <p className="leading-[0.6] text-[150px] font-extrabold text-yellow-400 opacity-80 ">war</p>
//                          <p className="leading-[0.6] text-[200px] font-extrabold text-yellow-400 opacity-60">war</p>
//                      </div>
//                      <img ref={imgref} src={outputImage}
//                          style={{ filter: "grayscale(100%)" }}
//                          alt="Output" className="w-96 h-96 object-cover  contrast-150 brightness-100 grayscale  absolute" />
//                  </div>
//              )}
//          </div>
//           )}
//         </div>
//       </div>

//       <button
//         onClick={Divtoimg}
//         className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
//       >
//         Download as Image
//       </button>
//       {imgsrc && <Addsunglasses imgsrc={imgsrc} />}
//     </div>
//   );
// }