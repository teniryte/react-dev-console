import styled from 'styled-components';
import { LineType } from '../types/line.type';
import {
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LineTypeEnum } from '../types/line-type.enum';
import { ConsoleLine } from './ConsoleLine';
import { v4 as uuidv4 } from 'uuid';
import { formatTime } from '../util/format-time';
import { ConsolePrompt } from './ConsolePrompt';
import { ConsoleHeader } from './ConsoleHeader';

const STATE: {
  timers: Record<string, number>;
  tempCounter: number;
} = {
  timers: {},
  tempCounter: 0,
};

const StyledMobileConsole = styled.div`
  padding: 5px;
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: auto;
  height: 35vh;
  background: oklch(20.8% 0.042 265.755);
  box-sizing: border-box;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 36px;
  color: #fff;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
`;

export const MobileConsole = ({ onClose }: { onClose?: () => void }) => {
  const [consoleRef, setConsoleRef] = useState<HTMLDivElement | null>(null);
  const [code, setCode] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const promptRef = useRef<{ focus: () => void }>(null);

  const [lines, setLines] = useState<LineType[]>([]);

  const scrollToBottom = useCallback(() => {
    if (consoleRef) {
      consoleRef.scrollTop = consoleRef.scrollHeight;
    }
  }, [consoleRef]);

  const addLine = useCallback(
    () => (type: LineTypeEnum, values: any[]) => {
      setTimeout(() => {
        setLines((prev) => [...prev, { uid: uuidv4(), type, values }]);
      }, 0);
    },
    []
  );

  const storeTempValue = (value: any) => {
    STATE.tempCounter++;
    const key = `temp${STATE.tempCounter}`;
    (window as any)[key] = value;
    addLine()(LineTypeEnum.Debug, [`Stored as ${key}`]);
    startTransition(() => {
      promptRef.current?.focus();
    });
  };

  const startTimer = useCallback((name: string = 'default') => {
    STATE.timers[name] = Date.now();
  }, []);

  const stopTimer = useCallback((name: string = 'default') => {
    const start = STATE.timers[name];
    if (!start) {
      return;
    }
    const end = Date.now();
    const duration = end - start;
    addLine()(LineTypeEnum.Debug, [`${name}: ${formatTime(duration)}`]);
  }, []);

  const clearConsole = useCallback(() => {
    setLines([]);
    setCode('');
    startTransition(() => {
      addLine()(LineTypeEnum.Debug, ['console cleared']);
    });
  }, []);

  const evalCode = useCallback(
    (code: string) => {
      setCode('');

      if (code === 'clear') {
        clearConsole();
        return;
      }

      addLine()(LineTypeEnum.Eval, [code]);

      try {
        const result = eval(code);
        addLine()(LineTypeEnum.Log, [result]);
      } catch (err) {
        addLine()(LineTypeEnum.Error, [err]);
      } finally {
        setHistoryIndex(0);
        setHistory((prev) => [...prev, code]);
        setCode('');
      }
    },
    [setCode]
  );

  const prevHistoryCode = useCallback(() => {
    setHistoryIndex((prev) => (prev + 1 < history.length ? prev + 1 : prev));
    startTransition(() => {
      const code = history[history.length - historyIndex - 1];
      if (!code) return;
      setCode(code);
    });
  }, [historyIndex, history]);

  const nextHistoryCode = useCallback(() => {
    setHistoryIndex((prev) => (prev - 1 > 0 ? prev - 1 : prev));
    startTransition(() => {
      const code = history[history.length - historyIndex];
      if (!code) return;
      setCode(code);
    });
  }, [historyIndex, history]);

  const consoleExtension = useMemo(() => {
    return {
      log(...args: any) {
        addLine()(LineTypeEnum.Log, args);
      },
      debug(...args: any) {
        addLine()(LineTypeEnum.Debug, args);
      },
      info(...args: any) {
        addLine()(LineTypeEnum.Info, args);
      },
      error(...args: any) {
        addLine()(LineTypeEnum.Error, args);
      },
      time: startTimer,
      timeEnd: stopTimer,
    };
  }, [addLine, startTimer, stopTimer]);

  const originalConsole = useMemo(
    () => ({
      log: console.log,
      debug: console.debug,
      info: console.info,
      error: console.error,
      time: console.time,
      timeEnd: console.timeEnd,
    }),
    []
  );

  useLayoutEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  useEffect(() => {
    Object.assign(console, consoleExtension);

    return () => {
      Object.assign(console, originalConsole);
    };
  }, []);

  return (
    <>
      <StyledMobileConsole ref={setConsoleRef}>
        {lines.map((line) => (
          <ConsoleLine key={line.uid} onValueClick={storeTempValue} {...line} />
        ))}

        <ConsolePrompt
          ref={promptRef}
          value={code}
          onChange={setCode}
          onCommit={evalCode}
          onPrev={prevHistoryCode}
          onNext={nextHistoryCode}
        />
      </StyledMobileConsole>
      <ConsoleHeader onClear={clearConsole} onClose={onClose} />
    </>
  );
};
