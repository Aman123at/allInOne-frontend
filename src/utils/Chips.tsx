import React from "react";
interface IChips {
  text: any;
  onClose: Function;
  forEdit?: Boolean;
  handleAddCategoryId?: any;
  categoryId?: any;
}
const Chips = ({
  text,
  onClose,
  forEdit,
  handleAddCategoryId,
  categoryId,
}: IChips) => {
  return (
    <span
      key={text.id}
      className="px-4 mt-2 py-2 rounded-full text-gray-500 bg-gray-200 font-semibold text-sm flex align-center w-max  active:bg-gray-300 transition duration-300 ease"
    >
      {text.val}
      <button
        onClick={() => {
          if (forEdit) {
            onClose(text);
            handleAddCategoryId(categoryId);
          } else {
            onClose(text.id);
          }
        }}
        className="bg-transparent hover focus:outline-none"
      >
        {forEdit ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-2 hover:cursor-pointer hover:scale-110"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="times"
            className="w-3 ml-3"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 352 512"
          >
            <path
              fill="currentColor"
              d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
            ></path>
          </svg>
        )}
      </button>
    </span>
  );
};

export default Chips;
