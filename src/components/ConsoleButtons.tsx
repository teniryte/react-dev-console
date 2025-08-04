import styled from 'styled-components';
import { ClearIcon } from '../icons/ClearIcon';
import { CloseIcon } from '../icons/CloseIcon';

const StyledButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // padding: 10px;
  position: fixed;
  right: 10px;
  bottom: 0;
  // background: oklch(20.8% 0.042 265.755);
`;

const StyledHeaderButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: 12px;
  cursor: pointer;
  padding: 6.5px;

  svg {
    width: 16px;
    height: 16px;
    fill: rgba(255, 255, 255, 0.2);
    stroke: rgba(255, 255, 255, 0.2);
  }

  &:hover {
    svg {
      fill: rgba(255, 255, 255, 0.5);
      stroke: rgba(255, 255, 255, 0.5);
    }
  }
`;

export const ConsoleButtons = ({
  onClear,
  onClose,
}: {
  onClear?: () => void;
  onClose?: () => void;
}) => {
  return (
    <StyledButtons>
      <StyledHeaderButton title="Clear console" onClick={onClear}>
        <ClearIcon />
      </StyledHeaderButton>
      <StyledHeaderButton title="Close console" onClick={onClose}>
        <CloseIcon />
      </StyledHeaderButton>
    </StyledButtons>
  );
};
