import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { initializeIcons } from '@fluentui/react';

import './global.css';

import { Header } from './components/Header';
import { Nav } from './components/Nav';

import { HomePage } from './pages/index';
import { DetailPage } from './pages/detail';
import { SearchPage } from './pages/search';

(() => {
  initializeIcons();
  ReactDOM.render(
    <HashRouter>
      <Header />
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detail/:pkgName" element={<DetailPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </HashRouter>,
    document.getElementById('root')
  );
})();
