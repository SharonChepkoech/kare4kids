import { useNavigate } from "react-router-dom";

interface Sitter {
  id: number;
  name: string;
  location: string;
  profile_picture: string;
}

const SitterCard: React.FC<{ sitter: Sitter }> = ({ sitter }) => {
  const navigate = useNavigate();

  return (
    <div
      key={sitter.id}
      onClick={() => navigate(`/sitters/${sitter.id}`)}
      className="p-4 rounded-lg shadow-md bg-[#FFFFFF] border border-[#2A9D8F] text-center cursor-pointer transition-transform transform hover:scale-105"
    >
      <img
        src={sitter.profile_picture || "/default-avatar.png"}
        alt={sitter.name}
        className="w-24 h-24 rounded-full mx-auto mb-2 border-2 border-[#2A9D8F]"
      />
      <h3 className="font-medium text-[#264653]">{sitter.name}</h3>
      <p className="text-gray-600">Babysitter in {sitter.location}</p>
    </div>
  );
};

export default SitterCard;
