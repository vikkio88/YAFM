import React, { Component } from 'react';

import generator from 'libs/generator';
import { entities } from 'db';

import { Button } from 'components/common';

import './assets/main.css';


class App extends Component {
  state = {
    players: [],
    loading: true
  };

  async componentDidMount() {
    const playersInDb = await entities.players.count();
    let players = [];
    if (playersInDb > 0) {
      players = await entities.players.getAll();
    } else {
      players = generator.players();
      players.forEach(p => entities.players.create(p));
    }
    console.log('players', players);
    this.setState({ players, loading: false });

  }

  deleteAll = async () => {
    this.setState({ loading: true });
    await entities.players.deleteAll();
    this.setState({ loading: false, players: [] });
  };

  generate = async () => {
    this.setState({ loading: true });
    const players = generator.players();
    players.forEach(async p => await entities.players.create(p));
    this.setState({ loading: false, players: players });
  };

  render() {
    const { players, loading } = this.state;
    if (loading) return <h1>Loading...</h1>;
    return (
      <main className="mx-auto h-full w-full border" >
        <Button onClick={this.deleteAll} disabled={!players.length}>Delete all</Button>
        <Button onClick={this.generate} disabled={players.length}>generate</Button>
        <pre>
          {JSON.stringify(players, null, 1)}
        </pre>
      </main>
    );
  }
}

export default App;
