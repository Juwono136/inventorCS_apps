import { Link } from "react-router-dom";
import { getFullDay } from "../../common/Date";

// icons and material-tailwind
import {
  FaYoutube,
  FaInstagram,
  FaFacebookSquare,
  FaGithub,
  FaGlobeAmericas,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const iconMap = {
  youtube: FaYoutube,
  instagram: FaInstagram,
  facebook: FaFacebookSquare,
  github: FaGithub,
  twitter: FaSquareXTwitter,
  website: FaGlobeAmericas,
};

const SocialComponent = ({ className, social_links = {}, joinedAt }) => {
  return (
    <div className={"w-full " + className}>
      <p className="text-xs text-center text-purple-800 font-semibold">
        Joined on {getFullDay(joinedAt)}
      </p>

      <div className="flex gap-x-4 gap-y-2 flex-wrap my-7 items-center justify-center text-gray-800">
        {Object.keys(social_links).map((key) => {
          const link = social_links[key];
          const Icon = iconMap[key];

          return link && Icon ? (
            <Link to={link} key={key} target="_blank">
              <Icon className="text-2xl text-indigo-800 hover:text-black" />
            </Link>
          ) : (
            ""
          );
        })}
      </div>
    </div>
  );
};

export default SocialComponent;
