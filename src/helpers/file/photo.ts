import store from "@/store";

import RegExp from "@/helpers/regExp";

const ResolveImageURL = (url: string | null, dispatchTarget: string): void => {
  if(typeof url == "string") 
  {
    const fileFormat = url.match(RegExp.FileFormat)![0];
    const imageURL = url.match(RegExp.BlobFormat)![0];

    const reader = new FileReader();
    reader.readAsDataURL(new Blob([imageURL], { type: fileFormat }));
    let result = null;

    reader.onload = () => {
      result = reader.result;
      store.dispatch(dispatchTarget, result);
    };
  }
  else return;
}

export default ResolveImageURL;