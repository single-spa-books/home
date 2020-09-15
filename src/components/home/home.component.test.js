import React from "react";
import { render } from "@testing-library/react";
import Home from "./home.component";

describe("Root component", () => {
  it("should be in the document", () => {
    const { getByText } = render(<Home name="Testapp" />);
    expect(getByText(/Testapp is mounted!/i)).toBeInTheDocument();
  });
});
