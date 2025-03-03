import { useRef, useState } from "react";
import axios from "axios";
import Addsunglasses from "./components/Addsunglasses";
import html2canvas from "html2canvas";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gray_img, setgray_img] = useState(null);

  const divref = useRef(null)
  const imgref = useRef(null)

  const Divtoimg = async () => {
    if (!divref.current) return

    // Apply grayscale effect before capture
    imgref.current.style.filter = "grayscale(100%)";

    // const canvas = await html2canvas(divref.current);
    const canvas = await html2canvas(divref.current, {
      useCORS: true, // Allows external images to be captured
      allowTaint: true, // Helps with cross-origin images
      backgroundColor: null, // Keeps transparent background
      willReadFrequently: true, // Improves rendering for complex structures
    });


    const image = canvas.toDataURL("image/png");

    // Create a download link
    const link = document.createElement("a");
    link.href = image;
    link.download = "captured-div.png";
    link.click();
  }

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

    const apiKey = import.meta.VITE_api_key; // Replace with your API key
    const formData = new FormData();
    formData.append("image_file", selectedImage);
    formData.append("size", "auto");

    try {
      setLoading(true);
      const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
        headers: {
          "X-Api-Key": apiKey,
        },
        responseType: "blob",
      });

      const imageUrl = URL.createObjectURL(response.data);
      setOutputImage(imageUrl);
    } catch (error) {
      console.error("Error removing background:", error);
      alert("Failed to remove background. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center p-5 gap-5">

      <div className="bg-red-500">
        <h2 className="text-2xl font-bold mb-4">Remove Background from Image</h2>

        <input type="file" accept="image/*" onChange={handleImageChange} className="mb-3" />

        <div>
          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="w-64 h-auto border p-2 mb-3"
            />
          )}
        </div>
      </div>


      <div className="flex flex-col">
        <button
          onClick={removeBackground}
          className="bg-blue-500 border border-zinc-600 text-white px-4 py-2 rounded-md relative"
          disabled={loading}
        >
          {loading ? "Processing..." : "Remove Background"}
        </button>

        <div className="w-96">
          {outputImage && (
            <div ref={divref} className=" relative w-96  h-96 bg-red-600  ">
              {/* <h3 className="text-lg font-semibold mb-2 ">Output Image:</h3> */}
              <div className="text-center flex flex-col justify-center absolute w-96 h-96 bg-red-600 font-serif">
                <p className="text-9xl font-extrabold text-orange-400 opacity-100 mb-[-100px]">war</p>
                <p className="text-[150px] font-extrabold text-orange-400 opacity-80 mb-[-170px]">war</p>
                <p className="text-[200px] font-extrabold text-orange-400 opacity-60">war</p>
              </div>
              <img ref={imgref} src={outputImage}
                style={{ filter: "grayscale(100%)" }}

                alt="Output" className="w-96 h-96 object-cover  contrast-100 brightness-105 grayscale  absolute" />
            </div>
          )}
        </div>

      </div>



      <p>--------------------</p>
      <button
        onClick={Divtoimg}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Download as Image
      </button>
      <Addsunglasses></Addsunglasses>
    </div>

  );
}

export default App;
