import { startTransition, useRef } from 'react';
import styled from 'styled-components';

const StyledPrompt = styled.div`
  box-sizing: border-box;
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;

  input {
    border: none;
    background: oklch(27.9% 0.041 260.031);
    font-family: monospace;
    padding: 10px;
    font-size: 12px;
    display: block;
    width: 100%;
    box-sizing: border-box;
    border-radius: 0;
    outline: none !important;
    color: oklch(86.9% 0.022 252.894);
    border-top: 1px solid rgba(255, 255, 255, 0.05);

    &:focus {
      // border-top: 2px solid rgba(255, 255, 255, 0.1);
      border-top: 1px solid oklch(68.1% 0.162 75.834);
      border-position: ;
      // background: oklch(37.2% 0.044 257.287);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.2);
    }
  }
`;

export const ConsolePrompt = ({
  value,
  onChange,
  onCommit,
  onPrev,
  onNext,
}: {
  value: string;
  onChange: (value: string) => void;
  onCommit: (code: string) => void;
  onPrev: () => void;
  onNext: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const inputKeyPressed = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      onCommit(value);
    }

    if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      onPrev();
    }

    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      onNext();
    }

    startTransition(() => {
      inputRef.current?.focus();
    });
  };

  return (
    <StyledPrompt>
      <input
        value={value}
        autoComplete="eval-code"
        type="text"
        onChange={(ev) => onChange(ev.target.value)}
        name="eval-code"
        onKeyDown={inputKeyPressed}
        ref={inputRef}
        placeholder="Enter your code..."
      />
    </StyledPrompt>
  );
};
