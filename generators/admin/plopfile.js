// eslint-disable-next-line func-names
module.exports = function (plop) {
  plop.setGenerator('component', {
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: "What's the name of the component you want to create?",
      },
      {
        type: 'input',
        name: 'useCase',
        message: "What's name of the useCase you want to create?",
      },
    ],
    actions: [
      {
        type: 'add',
        path: '../../src/controller/admin/{{ camelCase name }}/{{ camelCase useCase }}/{{ pascalCase name }}{{ pascalCase useCase }}Controller.ts',
        templateFile: '../templates/controller.ts.hbs',
      },
      {
        type: 'add',
        path: '../../src/controller/admin/{{ camelCase name }}/{{ camelCase useCase }}/{{ pascalCase name }}{{ pascalCase useCase }}UseCase.ts',
        templateFile: '../templates/useCase.ts.hbs',
      },
    ],
  });
};
