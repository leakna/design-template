import { fabric } from "fabric";

export const addEvent = (textBox: fabric.Textbox) => {
  console.log("Event added for textbox:", textBox.name); // Log the textbox name
  textBox.on("editing:entered", () => {
    console.log("Editing started for:", textBox.name);
  });
  textBox.on("editing:exited", () => {
    console.log("Text editing:", textBox.text);
  });
};

export const buildObject = (
  name: string,
  value: string,
  previousObject: fabric.Textbox | fabric.Group,
  previousTypeObject?: fabric.Textbox | fabric.Group
): {
  newTextbox: fabric.Textbox | fabric.Group;
  previousObject: fabric.Textbox | fabric.Group;
} => {
  let newTextbox:fabric.Textbox | fabric.Group | any = fabric.util.object.clone(
    //cloning single object
    previousTypeObject || previousObject
  );
  if (previousTypeObject instanceof fabric.Group) {
    console.log("inside:", previousTypeObject.name);
    previousTypeObject.clone((clonedGroup: fabric.Group) => {
      newTextbox = clonedGroup;

      const [backgroundBar, loadingBar] = newTextbox.getObjects();
      
      // Modify the loadingBar properties
      loadingBar.set({
        visible: true,
        opacity: 1,
        width: Number(backgroundBar.width) * (Number(value) / 100),
      });

      // Set the position of the cloned group
      newTextbox.set({
        top: previousObject.top! + (previousObject.height!/2),
        left: previousObject.left! + previousObject.width! ,
      });
    });
    
  } else {
    newTextbox.set("text", String(value));
    newTextbox.set("top", previousObject.top! + previousObject.height! + 20);
  }
  newTextbox.set("name", name);
  previousObject = newTextbox!;
  return { newTextbox, previousObject };
};
