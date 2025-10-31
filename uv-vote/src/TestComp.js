import { useEffect } from "react";

function TestComp() {

  useEffect(() => {
    console.log("TestComp mounted");
    return () => {
      console.log("TestComp unmounted");
    };
  }, []);

  return (
    <div>
      <h2>Test Component</h2>
      <p>This is a test component to demonstrate useEffect.</p>
    </div>
  );
}

export default TestComp;