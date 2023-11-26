export default async (filePath) => {
   try {
      return (await fetch(filePath)).json();
   } catch (err) {
      console.warn(err);
   }
};