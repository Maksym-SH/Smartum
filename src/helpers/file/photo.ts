import store from "@/store";

import RegExp from "@/helpers/regExp";

const ResolvephotoURL = (url: string | null, dispatchTarget: string): void => {
  if(typeof url == "string") 
  {
    const EFileFormat = url.match(RegExp.FileFormat)![0];
    const photoURL = url.match(RegExp.BlobFormat)![0];

    const reader = new FileReader();
    reader.readAsDataURL(new Blob([photoURL], { type: EFileFormat }));
    let result = null;

    reader.onload = () => {
      result = reader.result;
      store.dispatch(dispatchTarget, result);
    };
  }
  else return;
}

export default ResolvephotoURL;