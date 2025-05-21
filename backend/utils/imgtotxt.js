import Tesseract from "tesseract.js";

export const getTextFromImage = async (image) => {
  try {
    const response = await Tesseract.recognize(image, "eng");
    return response.data.text;
  } catch (err) {
    return err.message;
  }
};
