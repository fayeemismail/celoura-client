import { FaUserCircle } from "react-icons/fa";
import { Guide } from "../../../types/IGuideOnDestination";

export default function GuideInfo({ guide }: { guide: Guide }) {
  return (
    <div className="p-8 border-b border-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Book Guide: {guide.name}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          {guide.profilePic ? (
            <img src={guide.profilePic} alt={guide.name} className="w-32 h-32 rounded-full object-cover" />
          ) : (
            <FaUserCircle className="w-32 h-32 text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">{guide.name}</h2>
          <p className="text-gray-600 mb-1"><span className="font-medium">Email:</span> {guide.email}</p>
          <p className="text-gray-600 mb-3"><span className="font-medium">Based in:</span> {guide.basedOn}</p>
          <p className="text-gray-700 mb-4">{guide.bio}</p>
          <div className="mb-4">
            <h3 className="font-medium mb-1">Followers:</h3>
            <p>{guide.followers?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
