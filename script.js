class RecintosZoo {
  constructor() {
      this.recintos = [
          { numero: 1, bioma: 'Savana', tamanho: 10, animais: { Macaco: 3 } },
          { numero: 2, bioma: 'Floresta', tamanho: 5, animais: {} },
          { numero: 3, bioma: 'Savana e Rio', tamanho: 7, animais: { Gazela: 1 } },
          { numero: 4, bioma: 'Rio', tamanho: 8, animais: {} },
          { numero: 5, bioma: 'Savana', tamanho: 9, animais: { Leão: 1 } }
      ];

      this.animaisInfo = {
          Leão: { tamanho: 3, bioma: 'Savana', carnívoro: true },
          Leopardo: { tamanho: 2, bioma: 'Savana', carnívoro: true },
          Crocodilo: { tamanho: 3, bioma: 'Rio', carnívoro: true },
          Macaco: { tamanho: 1, bioma: 'Savana ou Floresta', carnívoro: false },
          Gazela: { tamanho: 2, bioma: 'Savana', carnívoro: false },
          Hipopotamo: { tamanho: 4, bioma: 'Savana e Rio', carnívoro: false }
      };
  }

  analisaRecintos(animal, quantidade) {
      const infoAnimal = this.animaisInfo[animal];
      if (!infoAnimal) {
          return { erro: 'Animal inválido' };
      }
      if (quantidade <= 0 || !Number.isInteger(quantidade)) {
          return { erro: 'Quantidade inválida' };
      }

      const recintosViaveis = this.recintos
          .filter(recinto => {
              const espaçoTotal = recinto.tamanho;
              const animaisExistentes = Object.keys(recinto.animais);
              const espaçoOcupado = animaisExistentes.reduce((acc, a) => acc + (this.animaisInfo[a].tamanho * recinto.animais[a]), 0);
              // Adiciona 1 unidade de espaço extra se houver mais de uma espécie
              const espaçoExtra = animaisExistentes.length > 0 ? 1 : 0;
              const espaçoLivre = espaçoTotal - espaçoOcupado - quantidade * infoAnimal.tamanho - espaçoExtra;

              // Verifica se o bioma do recinto é adequado para o animal
              const biomaAdequado = infoAnimal.bioma.split(' ou ').includes(recinto.bioma);

              // Verifica se o recinto é viável
              if (biomaAdequado && espaçoLivre >= 0) {
                  const contemCarnivoro = animaisExistentes.some(a => this.animaisInfo[a].carnívoro);

                  // Se o animal é carnívoro, verificar se pode ficar com outros carnívoros do mesmo bioma
                  if (infoAnimal.carnívoro) {
                      if (contemCarnivoro) {
                          const biomaIgual = animaisExistentes.every(a => this.animaisInfo[a].bioma === infoAnimal.bioma);
                          if (!biomaIgual) return false;
                      }
                  } else {
                      // Se não é carnívoro, impedir a entrada no recinto se já houver carnívoros
                      if (contemCarnivoro) return false;
                  }

                  return true;
              }
              return false;
          })
          .map(recinto => {
              const espaçoTotal = recinto.tamanho;
              const animaisExistentes = Object.keys(recinto.animais);
              const espaçoOcupado = animaisExistentes.reduce((acc, a) => acc + (this.animaisInfo[a].tamanho * recinto.animais[a]), 0);
              // Adiciona 1 unidade de espaço extra se houver mais de uma espécie
              const espaçoExtra = animaisExistentes.length > 0 ? 1 : 0;
              const espaçoLivre = espaçoTotal - espaçoOcupado - quantidade * infoAnimal.tamanho - espaçoExtra;
              return `Recinto ${recinto.numero} (espaço livre: ${espaçoLivre} total: ${espaçoTotal})`;
          });

      if (recintosViaveis.length > 0) {
          return { recintosViaveis, novoAnimal: animal };
      } else {
          return { erro: 'Não há recinto viável' };
      }
  }

  adicionarAnimal(recintoNumero, animal, quantidade) {
      const recinto = this.recintos.find(r => r.numero === recintoNumero);
      if (recinto) {
          if (!recinto.animais[animal]) {
              recinto.animais[animal] = 0;
          }
          recinto.animais[animal] += quantidade;
      }
  }

  listarRecintos() {
      return this.recintos.map(recinto => {
          const animais = Object.entries(recinto.animais).map(([animal, quantidade]) => `${quantidade} ${animal}`).join(', ');
          return `<div class="recinto">Recinto ${recinto.numero}: ${recinto.bioma} - Animais existentes: ${animais || 'nenhum'}</div>`;
      }).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const zoo = new RecintosZoo();
  const recintosList = document.getElementById('recintosList');
  recintosList.innerHTML = zoo.listarRecintos();

  document.getElementById('animalForm').addEventListener('submit', function(event) {
      event.preventDefault();

      const animal = document.getElementById('animal').value.trim();
      const quantidade = parseInt(document.getElementById('quantidade').value, 10);
      const resultado = zoo.analisaRecintos(animal, quantidade);

      const resultDiv = document.getElementById('result');
      if (resultado.erro) {
          resultDiv.textContent = resultado.erro;
      } else {
          resultDiv.innerHTML = `<p>Animal novo: ${resultado.novoAnimal}</p>${resultado.recintosViaveis.join('<br>')}`;
          
          // Adicionar o animal ao primeiro recinto viável
          const primeiroRecintoViavel = parseInt(resultado.recintosViaveis[0].match(/\d+/)[0], 10);
          zoo.adicionarAnimal(primeiroRecintoViavel, animal, quantidade);

          // Atualizar a lista de recintos
          recintosList.innerHTML = zoo.listarRecintos();
      }
  });
});
