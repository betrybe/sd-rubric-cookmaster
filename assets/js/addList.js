const createInput = (val) => {
  const input = document.createElement('input');
  input.name = 'ingredients[]';
  input.id = val;
  input.value = val;
  input.classList.add('input--not-border', 'input--small');
  input.readOnly = true;
  return input;
};

const createButton = (val) => {
  const button = document.createElement('button');
  button.classList.add('link', 'link--danger');
  button.id = `btn-${val}`;
  button.appendChild(document.createTextNode('Excluir Ingrediente'));
  button.onclick = function () {
    const inpt = document.getElementById(this.id.split('-')[1]);
    inpt.parentElement.remove();
    return false;
  };
  return button;
};

const createLi = () => {
  const li = document.createElement('LI');
  li.classList.add('d-flex', 'd-flex--between', 'w-100');
  return li;
};

document.querySelector('a[data-testid="adicionar-ingrediente"]')
  .addEventListener('click', (event) => {
    event.preventDefault();
    const inputValue = document.getElementById('nameIngredient');

    if (inputValue.value !== '') {
      const ul = document.querySelector('ul');
      const input = createInput(inputValue.value);
      const button = createButton(inputValue.value);
      const li = createLi();
      li.appendChild(input);
      li.appendChild(button);
      ul.appendChild(li);
    }
  });

document.querySelectorAll('button[type="button"]')
  .forEach((btn) => btn.addEventListener('click', (event) =>
    event.target.parentElement.remove()));
  
