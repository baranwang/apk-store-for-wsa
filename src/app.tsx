import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { initializeIcons } from '@fluentui/react';

import './global.css';

import { HomePage } from './pages/index';
import { DetailPage } from './pages/detail';

(() => {
  initializeIcons();
  ReactDOM.render(
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detail/:pkgName" element={<DetailPage />} />
      </Routes>
    </HashRouter>,
    document.getElementById('root')
  );
})();
