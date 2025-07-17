import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Sidebar from "../../components/guide/GuideSidebar";
import GuideNavbar from "../../components/guide/GuideNavbar";
import {
  User, Settings, Heart, MessageCircle,
  Image as ImageIcon, X, ChevronLeft,
  ChevronRight, Bookmark, Send
} from "lucide-react";
import {
  getGuideAllPosts,
  getProfileGuide,
  getSinglePostThunk,
  likePostThunk,
  unlikePostThunk,
  addCommentThunk,
  addReplyCommentThunk
} from "../../redux/guide/authThunks";
import { Guide } from "../../types/Guide";
import { IPostSummary } from "../../types/IPostSummary";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const GuideProfile = () => {
  const { isAuthenticated, currentGuide } = useSelector((state: RootState) => state.guide);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [guideProfile, setGuideProfile] = useState<Guide | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [posts, setPosts] = useState<IPostSummary[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleProfile = async (id: string) => {
    try {
      const response = await dispatch(getProfileGuide(id))
      setGuideProfile(response);
    } catch (error) {
      console.error("Failed to fetch guide profile", error);
      toast.error("Failed to load profile");
    }
  };

  const fetchAllPosts = async () => {
    try {
      const response = await dispatch(getGuideAllPosts(currentGuide?.id!))
      setPosts(response);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      toast.error("Failed to load posts");
    }
  };

  const handleViewPost = async (postId: string) => {
    try {
      const response = await dispatch(getSinglePostThunk(postId));
      setSelectedPost(response);
      setCurrentPostIndex(posts.findIndex(post => post._id === postId));
      setCurrentImageIndex(0);
      document.body.style.overflow = 'hidden';
    } catch (error) {
      toast.error("Failed to load post");
    }
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    setReplyingTo(null);
    document.body.style.overflow = 'auto';
  };

  const handleNextPost = () => {
    if (currentPostIndex < posts.length - 1) {
      const nextIndex = currentPostIndex + 1;
      handleViewPost(posts[nextIndex]._id);
    }
  };

  const handlePrevPost = () => {
    if (currentPostIndex > 0) {
      const prevIndex = currentPostIndex - 1;
      handleViewPost(posts[prevIndex]._id);
    }
  };

  const handleNextImage = () => {
    if (selectedPost && currentImageIndex < selectedPost.photo.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (selectedPost && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleCreatePost = () => {
    navigate("/guide/create-post");
  };

  const handleEditProfile = () => {
    navigate("/guide/edit-profile");
  };

  const handleLikePost = async () => {
    if (!selectedPost) return;

    try {
      if (selectedPost.likes.some((like: any) => like._id === currentGuide?.id)) {
        await dispatch(unlikePostThunk(selectedPost._id, currentGuide?.id!))
        setSelectedPost({
          ...selectedPost,
          likes: selectedPost.likes.filter((like: any) => like._id !== currentGuide?.id)
        });
      } else {
        await dispatch(likePostThunk(selectedPost._id, currentGuide?.id!))
        setSelectedPost({
          ...selectedPost,
          likes: [...selectedPost.likes, { _id: currentGuide?.id }]
        });
      }
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedPost || isCommenting) return;

    setIsCommenting(true);
    try {
      const response = await dispatch(addCommentThunk({
        postId: selectedPost._id,
        content: commentText,
        userId: currentGuide?.id!
      }));

      setSelectedPost({
        ...selectedPost,
        comments: [...selectedPost.comments, response]
      });
      setCommentText("");
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleAddReply = async () => {
    if (!replyText.trim() || !selectedPost || !replyingTo || isReplying) return;

    setIsReplying(true);
    try {
      const response = await dispatch(addReplyCommentThunk({
        postId: selectedPost._id,
        content: replyText,
        userId: currentGuide?.id!,
        parentId: replyingTo
      }));

      // Find the parent comment and add the reply to its replies array
      const updatedComments = selectedPost.comments.map((comment: any) => {
        if (comment._id === replyingTo) {
          return {
            ...comment,
            replies: [...(comment.replies || []), response]
          };
        }
        return comment;
      });

      setSelectedPost({
        ...selectedPost,
        comments: updatedComments
      });
      setReplyText("");
      setReplyingTo(null);
      toast.success("Reply added");
    } catch (error) {
      toast.error("Failed to add reply");
    } finally {
      setIsReplying(false);
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/guide/login");
    } else {
      handleProfile(currentGuide?.id!);
      fetchAllPosts();
    }
  }, [isAuthenticated, currentGuide?.id]);

  return (
    <div className="min-h-screen flex bg-[#000] text-white">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <GuideNavbar />
        <main className="pt-24 px-4 pb-10">
          {/* Profile Section */}
          {guideProfile && (
            <div className="bg-[#111] p-6 rounded-2xl shadow-md relative max-w-4xl mx-auto">
              {/* Action Menu */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-700 rounded-full transition"
                >
                  <Settings className="w-6 h-6 text-gray-400" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-[#1c1c1c] border border-gray-700 rounded-md shadow-lg z-50">
                    <button
                      onClick={handleCreatePost}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-700"
                    >
                      Create New Post
                    </button>
                    <button
                      onClick={handleEditProfile}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-700"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Content */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-8">
                <div className="flex-shrink-0 w-32 h-32 relative mb-4 sm:mb-0">
                  {guideProfile.profilePic ? (
                    <img
                      src={guideProfile.profilePic}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#09b86c]"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-[#09b86c] bg-gray-800 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold mb-1">
                    {guideProfile.name || "User"}
                  </h2>
                  <p className="text-gray-400 mb-3">
                    @{currentGuide?.email?.split("@")[0]}
                  </p>
                  <p className="text-sm text-gray-300 max-w-md mx-auto sm:mx-0">
                    {guideProfile.bio?.trim() || "Add bio"}
                  </p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-8 grid grid-cols-3 text-center gap-4 text-sm text-gray-400">
                <div>
                  <p className="text-lg font-semibold text-white">{guideProfile.destinations.length}</p>
                  <p>Destinations</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{guideProfile.followers.length}</p>
                  <p>Followers</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{guideProfile.happyCustomers.length}</p>
                  <p>Happy Customers</p>
                </div>
              </div>
            </div>
          )}

          {/* Posts Grid */}
          <div className="mt-10 grid grid-cols-3 gap-2 max-w-4xl mx-auto">
            {posts.map((post) => (
              <div
                key={post._id}
                onClick={() => handleViewPost(post._id)}
                className="relative group cursor-pointer overflow-hidden rounded-md"
              >
                <img
                  src={post.photo[0]}
                  alt="Post"
                  className="w-full h-full object-cover aspect-square transition-all duration-300 group-hover:brightness-50"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-1 text-white text-sm font-semibold drop-shadow-md">
                    <Heart className="w-5 h-5" /> {post.likesCount}
                  </div>
                  <div className="flex items-center gap-1 text-white text-sm font-semibold drop-shadow-md">
                    <MessageCircle className="w-5 h-5" /> {post.commentsCount}
                  </div>
                </div>
                {post.photo.length > 1 && (
                  <div className="absolute top-2 right-2 text-white bg-black bg-opacity-60 px-1 py-0.5 rounded text-xs">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Instagram-like Modal */}
          {selectedPost && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="relative w-full max-w-5xl h-full max-h-[90vh] flex bg-black rounded-lg overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                >
                  <X size={24} />
                </button>

                {/* Image Section */}
                <div className="relative flex-1 flex items-center justify-center bg-black group">
                  <img
                    src={selectedPost.photo[currentImageIndex]}
                    alt={selectedPost.caption || "Post image"}
                    className="max-h-full max-w-full object-contain"
                  />

                  {/* Image Navigation Arrows */}
                  {selectedPost.photo.length > 1 && (
                    <>
                      {currentImageIndex > 0 && (
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/60 hover:scale-110"
                        >
                          <ChevronLeft size={32} strokeWidth={1.5} />
                        </button>
                      )}

                      {currentImageIndex < selectedPost.photo.length - 1 && (
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/60 hover:scale-110"
                        >
                          <ChevronRight size={32} strokeWidth={1.5} />
                        </button>
                      )}
                    </>
                  )}

                  {/* Post Navigation Arrows */}
                  {posts.length > 1 && (
                    <>
                      {currentPostIndex > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrevPost();
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/60 hover:scale-110 z-10"
                        >
                          <ChevronLeft size={32} strokeWidth={1.5} />
                        </button>
                      )}

                      {currentPostIndex < posts.length - 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNextPost();
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/60 hover:scale-110 z-10"
                        >
                          <ChevronRight size={32} strokeWidth={1.5} />
                        </button>
                      )}
                    </>
                  )}

                  {/* Image Indicators */}
                  {selectedPost.photo.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {selectedPost.photo.map((_: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-[6px] h-[6px] rounded-full transition-all ${currentImageIndex === index ? 'bg-white w-[18px]' : 'bg-gray-500'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Sidebar */}
                <div className="w-96 border-l border-gray-800 flex flex-col">
                  {/* User Header */}
                  <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                      {guideProfile?.profilePic ? (
                        <img
                          src={guideProfile.profilePic}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold">{guideProfile?.name || currentGuide?.email?.split("@")[0]}</span>
                      <p className="text-xs text-gray-400">
                        {new Date(selectedPost.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Caption and Comments */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Caption */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {guideProfile?.profilePic ? (
                          <img
                            src={guideProfile.profilePic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={20} className="text-gray-500" />
                        )}
                      </div>
                      <div>
                        <span className="font-semibold">{guideProfile?.name || currentGuide?.email?.split("@")[0]}</span>
                        <p className="text-sm mt-1">{selectedPost.caption}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-400">
                          <span>
                            {selectedPost.likes.length} like{selectedPost.likes.length !== 1 ? 's' : ''}
                          </span>
                          <span>
                            {selectedPost.comments.length} comment{selectedPost.comments.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Comments */}
                    {selectedPost.comments.length > 0 ? (
                      selectedPost.comments.map((comment: any) => (
                        <div key={comment._id} className="space-y-3">
                          {/* Parent Comment */}
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                              {comment.user?.profilePic ? (
                                <img
                                  src={comment.user.profilePic}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User size={20} className="text-gray-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <span className="font-semibold">{comment.user?.username || "User"}</span>
                              <p className="text-sm mt-1">{comment.text}</p>
                              <div className="flex gap-3 mt-1 text-xs text-gray-400">
                                <span>
                                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                                <button 
                                  onClick={() => {
                                    setReplyingTo(comment._id);
                                    document.querySelector('.comment-input')?.scrollIntoView({ behavior: 'smooth' });
                                  }} 
                                  className="hover:text-white"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-10 pl-3 border-l-2 border-gray-700 space-y-3">
                              {comment.replies.map((reply: any) => (
                                <div key={reply._id} className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                    {reply.user?.profilePic ? (
                                      <img
                                        src={reply.user.profilePic}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <User size={16} className="text-gray-500" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <span className="font-semibold text-sm">{reply.user?.username || "User"}</span>
                                    <p className="text-xs mt-1">{reply.text}</p>
                                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                                      <span>
                                        {new Date(reply.createdAt).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-10">
                        No comments yet. Be the first to comment!
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 border-t border-gray-800">
                    <div className="flex justify-between mb-3">
                      <div className="flex gap-4">
                        <button
                          onClick={handleLikePost}
                          className="hover:opacity-70"
                        >
                          <Heart
                            size={24}
                            fill={
                              selectedPost.likes.some((like: any) => like._id === currentGuide?.id)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                        <button className="hover:opacity-70">
                          <MessageCircle size={24} />
                        </button>
                      </div>
                      <button className="hover:opacity-70">
                        <Bookmark size={24} />
                      </button>
                    </div>

                    <div className="text-sm font-semibold">
                      {selectedPost.likes.length} like{selectedPost.likes.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div className="p-4 border-t border-gray-800 comment-input">
                    {replyingTo && (
                      <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
                        <span>Replying to comment</span>
                        <button onClick={cancelReply} className="text-gray-500 hover:text-white">
                          Cancel
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={replyingTo ? "Write your reply..." : "Add a comment..."}
                        className="flex-1 bg-transparent text-sm outline-none placeholder-gray-500"
                        value={replyingTo ? replyText : commentText}
                        onChange={(e) => replyingTo ? setReplyText(e.target.value) : setCommentText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (replyingTo ? handleAddReply() : handleAddComment())}
                      />
                      <button
                        onClick={replyingTo ? handleAddReply : handleAddComment}
                        disabled={(replyingTo ? !replyText.trim() : !commentText.trim()) || (replyingTo ? isReplying : isCommenting)}
                        className={`${(replyingTo ? replyText.trim() : commentText.trim()) ? 'text-[#09b86c]' : 'text-gray-500'} font-semibold text-sm`}
                      >
                        {replyingTo ? 
                          (isReplying ? 'Posting...' : <Send size={20} />) : 
                          (isCommenting ? 'Posting...' : <Send size={20} />)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GuideProfile;