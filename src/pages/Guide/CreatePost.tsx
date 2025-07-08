import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GuideNavbar from "../../components/guide/GuideNavbar";
import Sidebar from "../../components/guide/GuideSidebar";
import { createNewPostThunk } from "../../redux/guide/authThunks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { toast } from "react-toastify";

const MAX_PHOTOS = 3;

const CreatePost = () => {
  const { isAuthenticated, currentGuide } = useSelector((state: RootState) => state.guide)
  const [photos, setPhotos] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const newPhotos = [...photos, ...selectedFiles].slice(0, MAX_PHOTOS);
    setPhotos(newPhotos);
  };

  useEffect(() => {
    if(!isAuthenticated){
        navigate('/guide/login');
    }
  }, [isAuthenticated, navigate]);

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  const handleSubmit = async () => {
    if (!caption.trim() || photos.length === 0) return;

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("commentsEnabled", String(commentsEnabled));
    photos.forEach((photo) => {
      formData.append("photos", photo);
    });
    formData.append("userId", currentGuide?.id!)

    try {
      // Replace this with actual dispatch or API call
        const response =  dispatch(createNewPostThunk(formData));
        console.log(response)
        toast.success('Posted successFully')
      navigate("/guide/profile");
    } catch (err) {
        toast.error('Cannot Post')
      console.error("Post submission failed", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <GuideNavbar />
        <main className="pt-24 px-4 pb-10">
          <div className="max-w-xl mx-auto bg-[#111] p-6 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

            {/* Photo Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Add Photos</label>

              <div
                onClick={() => document.getElementById("photo-upload")?.click()}
                className={`w-full h-40 bg-[#1c1c1c] border-2 border-dashed ${
                  photos.length >= MAX_PHOTOS
                    ? "border-gray-600 cursor-not-allowed"
                    : "border-gray-500 cursor-pointer"
                } rounded-lg flex items-center justify-center text-gray-400 hover:border-gray-300 transition`}
              >
                {photos.length < MAX_PHOTOS ? (
                  <span className="text-sm">Click to upload (max {MAX_PHOTOS} images)</span>
                ) : (
                  <span className="text-sm">Maximum {MAX_PHOTOS} photos added</span>
                )}
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  disabled={photos.length >= MAX_PHOTOS}
                  className="hidden"
                />
              </div>

              {/* Thumbnails with Hover Remove */}
              {photos.length > 0 && (
                <div className="flex gap-3 mt-4 flex-wrap">
                  {photos.map((photo, i) => (
                    <div
                      key={i}
                      className="relative group w-24 h-24 bg-gray-800 rounded-md overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`preview-${i}`}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 backdrop-blur bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button
                          onClick={() => handleRemovePhoto(i)}
                          className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                        >
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Caption */}
            <textarea
              className="w-full p-3 bg-[#1c1c1c] rounded-md border border-gray-700 mb-6"
              placeholder="Write a caption..."
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            {/* Comments Toggle */}
            <div className="flex items-center mb-6 gap-3">
              <label className="text-sm">Comments:</label>
              <button
                onClick={() => setCommentsEnabled((prev) => !prev)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                  commentsEnabled
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {commentsEnabled ? "Enabled" : "Disabled"}
              </button>
            </div>

            {/* Submit */}
            <button
              disabled={!caption.trim() || photos.length === 0}
              onClick={handleSubmit}
              className={`w-full py-2 rounded-md text-white font-semibold transition ${
                caption.trim() && photos.length
                  ? "bg-[#09b86c] hover:bg-green-600"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              Post
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatePost;
