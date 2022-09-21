import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Home from './components/Home';
import ArtistMain from './components/artists/ArtistMain';

//this is an additional code splitting mechanism where the different routes are being stored as different bundle files. They are fetched on demand. When webpack sees a System.import (it maually scans the codebase to find these calls) call, it forms a new module out of the file being imported. So it wouldn't make sense to put this import call into a helper utility,
const componentRoutes = {
  component: Home,
  path: "/",
  indexRoute: {
    component: ArtistMain,
  },
  childRoutes: [
    {
      path: 'artists/new',
      getComponent(location, cb) {
        //Error is the first argument to cb
        System.import('./components/artists/ArtistCreate').then((module) => cb(null, module.default))
      }
    },
    {
      path: 'artists/:id',
      getComponent(location, cb) {
        System.import('./components/artists/ArtistDetail').then((module) => cb(null, module.default))
      }
    },
    {
      path: 'artists/:id/edit',
      getComponent(location, cb) {
        System.import('./components/artists/ArtistEdit').then((module) => cb(null, module.default))
      }
    }
  ]
};

const Routes = () => {
  return (
    <Router history={hashHistory} routes={componentRoutes}/>
      /* <Route path="/" component={Home}>
        <IndexRoute component={ArtistMain} />
        <Route path="artists/new" component={ArtistCreate} />
        <Route path="artists/:id" component={ArtistDetail} />
        <Route path="artists/:id/edit" component={ArtistEdit} />
      </Route> */
  );
};

export default Routes;
