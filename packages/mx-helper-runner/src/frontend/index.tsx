import 'reflect-metadata';
import { createRoot } from 'react-dom/client';
import { App } from './components';

import './styles.css';

const container = createRoot(document.getElementById('root')!);
container.render(<App />);
