import React, { useState } from 'react';
import { DevConsole } from '../src';

function App() {
  const [showConsole, setShowConsole] = useState(true);

  return (
    <div>
      <iframe
        style={{
          border: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: '100%',
          height: '100%',
        }}
        src="https://teniryte.ru"
      />
      {showConsole && <DevConsole onClose={() => setShowConsole(false)} />}
    </div>
  );
}

export default App;
