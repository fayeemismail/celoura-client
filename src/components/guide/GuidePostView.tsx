import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { Heart, MessageCircle, Bookmark, MoreHorizontal, X, ChevronLeft, ChevronRight, User } from "lucide-react";
import { getSinglePostThunk, getGuideAllPosts } from "../../redux/guide/authThunks";
import { parseAxiosError } from "../../utils/parseAxiosError";
import { toast } from "react-toastify";
import GuideNavbar from "../../components/guide/GuideNavbar";
import Sidebar from "../../components/guide/GuideSidebar";

const GuidePostView = () => {
  const { postId } = useParams();
  const { isAuthenticated, currentGuide } = useSelector((state: RootState) => state.guide);
  const [post, setPost] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const fetchPost = async (id: string) => {
    try {
      const response = await dispatch(getSinglePostThunk(id));
      setPost(response);
    } catch (error) {
      const message = parseAxiosError(error);
      toast.error(message || "Failed to load post");
      navigate("/guide/profile");
    }
  };

  const fetchAllPosts = async () => {
    try {
      const response = await dispatch(getGuideAllPosts(currentGuide?.id!));
      setPosts(response);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/guide/login");
    }
    
    if (postId) {
      fetchPost(postId);
      fetchAllPosts();
    }
  }, [postId, isAuthenticated]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Dispatch like action here
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Dispatch save action here
  };

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const currentPostIndex = posts.findIndex(p => p._id === postId);
  const hasNext = currentPostIndex < posts.length - 1;
  const hasPrev = currentPostIndex > 0;

  const handleNextPost = () => {
    if (hasNext) {
      navigate(`/guide/posts/${posts[currentPostIndex + 1]._id}`);
    }
  };

  const handlePrevPost = () => {
    if (hasPrev) {
      navigate(`/guide/posts/${posts[currentPostIndex - 1]._id}`);
    }
  };

  if (!post) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex bg-[#000] text-white">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <GuideNavbar />
        <main className="pt-24 px-4 pb-10">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => navigate("/guide/profile")}
              className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <ChevronLeft size={20} />
              <span>Back to profile</span>
            </button>

            <div className="bg-[#111] rounded-xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image section */}
                <div className="relative flex-1 bg-black flex items-center justify-center min-h-[500px]">
                  <img
                    src={post.photo[currentImageIndex]}
                    alt="Post"
                    className="max-h-full max-w-full object-contain"
                  />

                  {/* Navigation arrows */}
                  {hasPrev && (
                    <button
                      onClick={handlePrevPost}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  {hasNext && (
                    <button
                      onClick={handleNextPost}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      <ChevronRight size={24} />
                    </button>
                  )}

                  {/* Image indicators for multiple photos */}
                  {post.photo.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {post.photo.map((_:string, index: number) => (
                        <button
                          key={index}
                          onClick={() => handleImageChange(index)}
                          className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-gray-500'}`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Sidebar section */}
                <div className="w-full md:w-96 bg-[#1c1c1c] border-l border-gray-800 flex flex-col">
                  {/* User header */}
                  <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <span className="font-semibold">{currentGuide?.email?.split("@")[0]}</span>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  {/* Caption section */}
                  <div className="p-4 border-b border-gray-800">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <div>
                        <span className="font-semibold">{currentGuide?.email?.split("@")[0]}</span>
                        <p className="text-sm mt-1">
                          {showCaption ? post.caption : `${post.caption.substring(0, 100)}...`}
                          {post.caption.length > 100 && (
                            <button 
                              onClick={() => setShowCaption(!showCaption)} 
                              className="text-gray-500 ml-1"
                            >
                              {showCaption ? "Show less" : "Show more"}
                            </button>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Comments section */}
                  <div className="flex-1 overflow-y-auto p-4">
                    {post.comments.length > 0 ? (
                      post.comments.map((comment: any) => (
                        <div key={comment._id} className="mb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                              <User size={16} className="text-gray-400" />
                            </div>
                            <div>
                              <span className="font-semibold">{comment.user?.username || "User"}</span>
                              <p className="text-sm">{comment.text}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-10">
                        No comments yet
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="p-4 border-t border-gray-800">
                    <div className="flex justify-between mb-2">
                      <div className="flex gap-4">
                        <button onClick={handleLike} className="hover:opacity-70">
                          <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
                        </button>
                        <button className="hover:opacity-70">
                          <MessageCircle size={24} />
                        </button>
                      </div>
                      <button onClick={handleSave} className="hover:opacity-70">
                        <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                    </div>

                    <div className="text-sm font-semibold mb-1">
                      {post.likesCount + (isLiked ? 1 : 0)} likes
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>

                  {/* Comment input */}
                  <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 bg-transparent text-sm outline-none border-b border-gray-700 focus:border-gray-500 py-1"
                      />
                      <button className="text-[#09b86c] font-semibold text-sm disabled:opacity-50">
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GuidePostView;