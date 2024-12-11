const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const helper = require('./helper.js');

const handleDomo = (e, onDomoAdded) => {
  e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#domoName').value;

  if (!name) {
    helper.handleError('All fields are required!');
    return false;
  }

  helper.sendPost(e.target.action, { name }, onDomoAdded);
  return false;
};

const DomoForm = (props) => {
  return(
    <form id='domoForm'
          onSubmit={(e) => handleDomo(e, props.triggerReload)}
          name='domoForm'
          action='/maker'
          method='POST'
          className='domoForm'
    >
      <label htmlFor='name'>Name: </label>
      <input id='domoName' type='text' name='name' placeholder='Domo Name' />
      <input className='makeDomoSubmit' type='submit' value="Make Domo" />
    </form>
  )
};

const DomoList = (props) => {
  const [domos, setDomos] = useState(props.domos);

  useEffect(() => {
    const loadDomosFromServer = async () => {
      const response = await fetch('/getDomos');
      const data = await response.json();
      setDomos(data.domos);
    };
    loadDomosFromServer();
  }, [props.reloadDomos]);

  if (domos.length === 0) {
    return (
      <div className='domoList'>
        <h3 className='emptyDomo'>No Domos Yet!</h3>
      </div>
    );
  }

  const domoNodes = domos.map(domo => {
    return (
      <div key={(domo.id)} className='domo'>
        <h3 className='domoName'>Name: {domo.name}</h3>
      </div>
    );
  });

  return(
    <div className='domoList'>
      {domoNodes}
    </div>
  );
};

const App = () => {
  const [reloadDomos, setReloadDomos] = useState(false);

  return (
    <div>
      <div id='makeDomo'>
          <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
      </div>
      <div id='domos'>
          <DomoList domos={[]} reloadDomos={reloadDomos} />
      </div>
    </div>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render( <App /> );
};

window.onload = init;
