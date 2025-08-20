import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Navbar from "../../components/user/home/Navbar";
import { User, Heart, MessageCircle, Image as ImageIcon, X, ChevronLeft, ChevronRight, Bookmark, Send } from "lucide-react";
import { IPostSummary } from "../../types/IPostSummary";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import COLORS from "../../styles/theme";
import { Guide } from "../../types/IPostSummaryOnUser";
import {
  addCommentOnGuidePostThunk,
  addReplyCommentOnGuidePostThunk,
  getAllPostGUideThunk,
  getGuideSingleDataThunk,
  likePostThunkUser,
  unLikePostThunkUser,
  followGuideThunk,
  unfollowGuideThunk,
  getGuideSinglePostThunk,
} from "../../redux/user/userThunks";
import { FollowButton } from "../../components/user/Guide/FollowButton";

const GuideProfileUserView = () => {
  const { isAuthenticated, currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { guideId } = useParams();
  const [guideProfile, setGuideProfile] = useState<Guide | null>(null);
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
      const response = await dispatch(getGuideSingleDataThunk(id));
      // console.log(guide)
      setGuideProfile(response);
    } catch (error) {
      console.error("Failed to fetch guide profile", error);
      toast.error("Failed to load profile");
    }
  };

  const fetchAllPosts = async (id: string) => {
    try {
      const response = await dispatch(getAllPostGUideThunk(id));
      setPosts(response);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      toast.error("Failed to load posts");
    }
  };

  const handleViewPost = async (postId: string) => {
    try {
      const response = await dispatch(getGuideSinglePostThunk(postId));
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

  const handleLikePost = async () => {
    if (!selectedPost || !isAuthenticated) return;

    try {
      if (selectedPost.likes.some((like: any) => like._id === currentUser?.id)) {
        await dispatch(unLikePostThunkUser(selectedPost._id, currentUser?.id!))
        setSelectedPost({
          ...selectedPost,
          likes: selectedPost.likes.filter((like: any) => like._id !== currentUser?.id)
        });
      } else {
        await dispatch(likePostThunkUser(selectedPost._id, currentUser?.id!))
        setSelectedPost({
          ...selectedPost,
          likes: [...selectedPost.likes, { _id: currentUser?.id }]
        });
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to update like");
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedPost || isCommenting || !isAuthenticated) return;

    setIsCommenting(true);
    try {
      const response = await dispatch(addCommentOnGuidePostThunk({
        postId: selectedPost._id,
        content: commentText,
        userId: currentUser?.id!
      }));

      setSelectedPost({
        ...selectedPost,
        comments: [...selectedPost.comments, response]
      });
      setCommentText("");
      toast.success("Comment added");
    } catch (error) {
      console.log(error, 'error while commenting');
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleAddReply = async () => {
    if (!replyText.trim() || !selectedPost || !replyingTo || isReplying || !isAuthenticated) return;

    setIsReplying(true);
    try {
      const response = await dispatch(addReplyCommentOnGuidePostThunk({
        postId: selectedPost._id,
        content: replyText,
        userId: currentUser?.id!,
        parentId: replyingTo
      }));

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
      console.log(error, 'Error on reply comment');
      toast.error("Failed to add reply");
    } finally {
      setIsReplying(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!guideId || !currentUser?.id || !guideProfile) return;

    try {
      if (guideProfile.followers.includes(currentUser.id)) {
        await dispatch(unfollowGuideThunk(guideId, currentUser.id));
        setGuideProfile({
          ...guideProfile,
          followers: guideProfile.followers.filter(id => id !== currentUser.id)
        });
        toast.success(`You've unfollowed ${guideProfile.name}`);
      } else {
        await dispatch(followGuideThunk(guideId, currentUser.id));
        setGuideProfile({
          ...guideProfile,
          followers: [...guideProfile.followers, currentUser.id]
        });
        toast.success(`You're now following ${guideProfile.name}`);
      }
    } catch (error) {
      console.error("Failed to update follow status", error);
      toast.error("Failed to update follow status");
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (guideId) {
      handleProfile(guideId);
      fetchAllPosts(guideId);
    }
  }, [isAuthenticated, guideId]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.cardBg }}>
      <Navbar />
      <main className="pt-24 px-4 pb-10 max-w-7xl mx-auto">
        {/* Profile Section */}
        {guideProfile && (
          <div
            className="p-6 rounded-2xl shadow-md relative mb-8"
            style={{
              backgroundColor: COLORS.cardBg,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            {/* Follow Button */}
            {currentUser && currentUser.id !== guideProfile._id && (
              <div className="absolute top-4 right-4">
                <FollowButton
                  isFollowing={guideProfile.followers.includes(currentUser.id)}
                  onToggleFollow={handleFollowToggle}
                />
              </div>
            )}

            {/* Profile Content */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-8">
              <div className="flex-shrink-0 w-32 h-32 relative mb-4 sm:mb-0">
                {guideProfile.profilePic ? (
                  <img
                    src={guideProfile.profilePic}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4"
                    style={{ borderColor: COLORS.accent }}
                  />
                ) : (
                  <div
                    className="w-32 h-32 rounded-full border-4 flex items-center justify-center"
                    style={{
                      borderColor: COLORS.accent,
                      backgroundColor: COLORS.accent + "20",
                    }}
                  >
                    <User className="w-16 h-16" style={{ color: COLORS.accent }} />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2
                  className="text-2xl font-bold mb-1"
                  style={{ color: COLORS.text }}
                >
                  {guideProfile.name || "Guide"}
                </h2>
                <p className="mb-3" style={{ color: COLORS.secondaryText }}>
                  @{guideProfile.email?.split("@")[0]}
                </p>
                <p
                  className="text-sm max-w-md mx-auto sm:mx-0"
                  style={{ color: COLORS.secondaryText }}
                >
                  {guideProfile.bio?.trim() || ""}
                </p>
                <p className="mt-2 text-sm" style={{ color: COLORS.secondaryText }}>
                  Based in: {guideProfile.basedOn || "Not specified"}
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-8 grid grid-cols-3 text-center gap-4 text-sm">
              <div>
                <p className="text-lg font-semibold" style={{ color: COLORS.text }}>
                  {guideProfile.destinations?.length || 0}
                </p>
                <p style={{ color: COLORS.secondaryText }}>Destinations</p>
              </div>
              <div>
                <p className="text-lg font-semibold" style={{ color: COLORS.text }}>
                  {guideProfile.followers.length || 0}
                </p>
                <p style={{ color: COLORS.secondaryText }}>Followers</p>
              </div>
              <div>
                <p className="text-lg font-semibold" style={{ color: COLORS.text }}>
                  {guideProfile.happyCustomers.length || 0}
                </p>
                <p style={{ color: COLORS.secondaryText }}>Happy Customers</p>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.text }}>
          Recent Posts
        </h3>

        {posts.length === 0 ? (
          <p className="text-center py-8" style={{ color: COLORS.secondaryText }}>
            This guide hasn't posted anything yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div
                key={post._id}
                onClick={() => handleViewPost(post._id)}
                className="relative group cursor-pointer overflow-hidden rounded-lg"
                style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}
              >
                <img
                  src={post.photo[0]}
                  alt="Post"
                  className="w-full h-64 object-cover transition-all duration-300 group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-1 text-white text-sm font-semibold">
                    <Heart className="w-5 h-5" fill="white" /> {post.likesCount}
                  </div>
                  <div className="flex items-center gap-1 text-white text-sm font-semibold">
                    <MessageCircle className="w-5 h-5" /> {post.commentsCount}
                  </div>
                </div>
                {post.photo.length > 1 && (
                  <div className="absolute top-2 right-2 text-white bg-black bg-opacity-60 px-1.5 py-1 rounded-full">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Instagram-like Modal */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl h-full max-h-[90vh] flex bg-white rounded-lg overflow-hidden">
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-50 text-gray-700 hover:text-gray-900 bg-white/80 rounded-full p-2"
              >
                <X size={24} />
              </button>

              {/* Image Section */}
              <div className="relative flex-1 flex items-center justify-center bg-gray-100 group">
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110"
                      >
                        <ChevronLeft size={32} strokeWidth={1.5} />
                      </button>
                    )}

                    {currentImageIndex < selectedPost.photo.length - 1 && (
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110"
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 z-10"
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 z-10"
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
                        className={`w-[6px] h-[6px] rounded-full transition-all ${currentImageIndex === index ? 'bg-gray-700 w-[18px]' : 'bg-gray-400'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="w-96 border-l border-gray-200 flex flex-col">
                {/* User Header */}
                <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
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
                    <span className="font-semibold">{guideProfile?.name || guideProfile?.email?.split("@")[0]}</span>
                    <p className="text-xs text-gray-500">
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
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
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
                      <span className="font-semibold">{guideProfile?.name || guideProfile?.email?.split("@")[0]}</span>
                      <p className="text-sm mt-1">{selectedPost.caption}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
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
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
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
                            <div className="flex gap-3 mt-1 text-xs text-gray-500">
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
                                className="hover:text-gray-700"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-10 pl-3 border-l-2 border-gray-300 space-y-3">
                            {comment.replies.map((reply: any) => (
                              <div key={reply._id} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
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
                                  <div className="flex gap-3 mt-1 text-xs text-gray-500">
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
                <div className="p-4 border-t border-gray-200">
                  <div className="flex justify-between mb-3">
                    <div className="flex gap-4">
                      <button
                        onClick={handleLikePost}
                        className="hover:opacity-70"
                      >
                        <Heart
                          size={24}
                          fill={
                            selectedPost.likes.some((like: any) => like._id === currentUser?.id)
                              ? "currentColor"
                              : "none"
                          }
                          style={{ color: COLORS.accent }}
                        />
                      </button>
                      <button className="hover:opacity-70" style={{ color: COLORS.accent }}>
                        <MessageCircle size={24} />
                      </button>
                    </div>
                    <button className="hover:opacity-70" style={{ color: COLORS.accent }}>
                      <Bookmark size={24} />
                    </button>
                  </div>

                  <div className="text-sm font-semibold" style={{ color: COLORS.text }}>
                    {selectedPost.likes.length} like{selectedPost.likes.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Comment Input */}
                <div className="p-4 border-t border-gray-200 comment-input">
                  {replyingTo && (
                    <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
                      <span>Replying to comment</span>
                      <button onClick={cancelReply} className="text-gray-400 hover:text-gray-700">
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
                      className={`${(replyingTo ? replyText.trim() : commentText.trim()) ? 'text-[#09b86c]' : 'text-gray-400'} font-semibold text-sm`}
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
  );
};

export default GuideProfileUserView;