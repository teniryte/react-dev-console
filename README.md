[![npm version](https://img.shields.io/npm/v/react-mobile-console.svg?color=blue)](https://www.npmjs.com/package/react-mobile-console) [![npm downloads](https://img.shields.io/npm/dm/react-mobile-console.svg?color=brightgreen)](https://www.npmjs.com/package/react-mobile-console) [![GitHub stars](https://img.shields.io/github/stars/teniryte/react-mobile-console?style=social)](https://github.com/teniryte/react-mobile-console) [![License](https://img.shields.io/github/license/teniryte/react-mobile-console)](LICENSE)

# react-mobile-console

<table>
<tr>
<td width="60%" valign="top">

A lightweight, debug console component for React applications that provides an external debugging interface similar to browser developer tools. Perfect for mobile development, testing, and debugging React apps in various environments.

## Features

- 🚀 **External Debug Console** - Overlay console that doesn't interfere with your app's UI
- 📱 **Mobile-Friendly** - Optimized for mobile devices with touch-friendly interface
- 🔧 **Interactive REPL** - Execute JavaScript code directly in the console


## Installation

```bash
npm install react-mobile-console
# or
yarn add react-mobile-console
```

## Quick Start

```tsx
import { MobileConsole } from 'react-mobile-console';

function App() {
  return (
    <>
      <MobileConsole onClose={() => setShowConsole(false)} />
    </>
  );
}
```

</td>
<td width="40%" align="center">

<img src="https://mobile-console.teniryte.ru/demo.png" width="500">

</td>
</tr>
</table>


## License

MIT © [teniryte](https://github.com/teniryte)
