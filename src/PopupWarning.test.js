import React from "react";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PopupWarning from "./PopupWarning";
import { BrowserRouter } from "react-router-dom";

it("renders WARNING when text is WARNING", () => {
  const { getByTestId } = render(
    <PopupWarning text="WARNING" hide={false} handlePopup={() => {}} />
  );
  expect(getByTestId("warning-text").textContent).toBe("WARNING");
});

it("renders component with class- hide-popup when hide is true", () => {
  const { getByTestId } = render(
    <PopupWarning text="WARNING" hide={true} handlePopup={() => {}} />
  );
  expect(
    getByTestId("popup-warning-container").classList.contains("hide-popup")
  ).toBeTruthy();
});

it("renders component with class- show-popup when hide is false", () => {
  const { getByTestId } = render(
    <PopupWarning text="WARNING" hide={false} handlePopup={() => {}} />
  );
  expect(
    getByTestId("popup-warning-container").classList.contains("show-popup")
  ).toBeTruthy();
});

// wrapped the component around a BrowserRouter because NavLink is called
it("renders component with href '/favorites' when redirectUrl is '/favorites'", () => {
  const { getByTestId } = render(
    <BrowserRouter>
      <PopupWarning
        hide={false}
        text="Remove from Favorites?"
        id={1}
        redirectUrl="/favorites"
        handlePopup={() => {}}
      />
    </BrowserRouter>
  );
  expect(getByTestId("link-container")).toHaveAttribute("href", "/favorites");
});

it("renders component without NavLink if redirectUrl is not passed in", () => {
  const { queryByTestId } = render(
    <BrowserRouter>
      <PopupWarning
        hide={false}
        text="Remove from Favorites?"
        handlePopup={() => {}}
      />
    </BrowserRouter>
  );
  expect(queryByTestId("link-container")).toBeFalsy();
});

it("sends 'ok' to props function when OK button is clicked", () => {
  const onClickHandler = jest.fn();
  const { getByTestId } = render(
    <PopupWarning text="WARNING" hide={false} handlePopup={onClickHandler} />
  );
  fireEvent.click(getByTestId("ok-button"));
  expect(onClickHandler).toHaveBeenCalledWith("ok");
});

it("sends 'cancel' to props function when CANCEL button is clicked", () => {
  const onClickHandler = jest.fn();
  const { getByTestId } = render(
    <PopupWarning text="WARNING" hide={false} handlePopup={onClickHandler} />
  );
  fireEvent.click(getByTestId("cancel-button"));
  expect(onClickHandler).toHaveBeenCalledWith("cancel");
});
