import React from 'react';
import CommentBox from './CommentBox';
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";


it("renders default text when '' is passed in", () => {
    const { getByTestId, queryByTestId } = render(
        <CommentBox
        value=""
        onEnter={() => {}}
      />
    );
    expect(getByTestId("comment-text").textContent).toBe("Click to add a comment");
    expect(queryByTestId("comment-input")).toBeFalsy();
  });

it("render NASA when value is NASA", () => {
    const { getByTestId, queryByTestId } = render(
        <CommentBox
        value="NASA"
        onEnter={() => {}}
      />
    );
    expect(getByTestId("comment-text").textContent).toBe("NASA");
    expect(queryByTestId("comment-input")).toBeFalsy();
  });

  // also checks that enter will not add \n when pressed
  it("changes from text to input when clicked and NASA is the current value and remaining characters is 146", () => {
    const onEnterHandler = jest.fn();
    const { getByTestId, queryByTestId } = render(
        <CommentBox
            value="NASA"
            onEnter={onEnterHandler}
        />
    );
    fireEvent.click(getByTestId("comment-text"));
    expect(queryByTestId("comment-input")).toBeTruthy(); //input-text is the textarea that replaces the <p> text
    expect(queryByTestId("comment-text")).toBeFalsy();
    expect(queryByTestId("comment-input").textContent).toBe("NASA");
    expect(queryByTestId("comment-input").nextElementSibling.firstChild.textContent).toBe("146");
  });

  it("Renders default text if enter is pressed when textarea value is entered blank", () => {
    const onEnterHandler = jest.fn();
    const { getByTestId} = render(
        <CommentBox
            value="NASA"
            onEnter={onEnterHandler}
        />
    );
    fireEvent.click(getByTestId("comment-text"));
    const input = getByTestId('comment-input');
    fireEvent.change(input, {
        target: {
            value: ""
        }
    });
    fireEvent.keyUp(input, {
        keyCode: 13
    });
    expect(getByTestId("comment-text").textContent).toBe("Click to add a comment");
  });

  it("Does not exit editMode if enter is pressed while input value length is over 150", () => {
    const onEnterHandler = jest.fn();
    const { queryByTestId, getByTestId } = render(
        <CommentBox
            value=""
            onEnter={onEnterHandler}
        />
    );
    fireEvent.click(getByTestId("comment-text"));
    const input = getByTestId('comment-input');
    fireEvent.change(input, {
        target: {
            // has 151 characters
            value: "!123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
        }
    });
    fireEvent.keyUp(input, {
        keyCode: 13
    });
    expect(queryByTestId("comment-text")).toBeFalsy();
  });

  it("Error appears when enter is pressed while input value has length over 150", () => {
    const onEnterHandler = jest.fn();
    const { getByTestId } = render (
        <CommentBox
            value=""
            onEnter={onEnterHandler}
        />
    );
    fireEvent.click(getByTestId("comment-text"));
    const input = getByTestId('comment-input');
    fireEvent.change(input, {
        target: {
            // has 151 characters
            value: "!123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
        }
    });
    fireEvent.keyUp(input, {
        keyCode: 13
    });
    expect(getByTestId("form-validation").textContent).toBe("Cannot save!");
  });

  it("Error disappears when input value is reduced to 150 or less", () => {
    const onEnterHandler = jest.fn();
    const { getByTestId, queryByTestId } = render (
        <CommentBox
            value="!123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
             onEnter={onEnterHandler}
        />
    );
    fireEvent.click(getByTestId("comment-text"));
    const input = getByTestId('comment-input');
    fireEvent.change(input, {
        target: {
            // has 150 characters
            value: "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
        }
    });
    fireEvent.keyUp(input, {
        keyCode: 13
    });
    expect(queryByTestId("form-validation")).toBeFalsy();
  });

  it("Renders initial text- NASA is escape is pressed", () => {
    const onEnterHandler = jest.fn();
    const { getByTestId } = render (
        <CommentBox
            value="NASA"
            onEnter={onEnterHandler}
        />
    );
    fireEvent.click(getByTestId("comment-text"));
    const input = getByTestId('comment-input');
    fireEvent.change(input, {
        target: {
            value: "1234567890"
        }
    });
    fireEvent.keyUp(input, {
        keyCode: 27
    });
    expect(getByTestId("comment-text").textContent).toBe("NASA");
  });

  

