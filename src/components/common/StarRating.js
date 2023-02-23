import { BsStar, BsStarHalf, BsStarFill } from "react-icons/bs";

const StarRating = ({ value }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(Math.floor(value))].map((_, index) => (
        <BsStarFill className="text-blue" key={index} />
      ))}
      {value % 1 >= 0.5 && <BsStarHalf className="text-blue" />}
      {value < 5 &&
        [...Array(Math.ceil(5 - (value % 1 >= 0.5 ? value + 1 : value)))].map(
          (_, index) => <BsStar className="text-blue" key={index} />
        )}
    </div>
  );
};

export default StarRating;
