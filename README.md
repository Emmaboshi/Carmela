# Carmela
Carmela è la style-guide di Emmaboshi studio.

## Installazione
1. Assicurati di aver installato `npm`,`grunt`, `sass`
2. Scarica e decomprimi il progetto.   
Da terminale, dentro la cartella del progetto, esegui   
`npm install`   
(assicurati di avere i permessi necessari).    
3. Infine dai il comando `grunt`.

## Convenzioni riguardo il codice

### Organizzazione dei file
Si è cercato di organizzare i file seguendo quanto più possibile l'approccio [_atomic design_](http://bradfrost.com/blog/post/atomic-web-design/).
A tal fine, tutta Carmela è stata sviluppata usando [Pattern Lab](http://patternlab.io/).

### Naming convention
Le classi css sono state organizzando cercando di rispettare la metodologia [BEM](http://getbem.com/naming/).

### Variabili
Le variabili che contengono colori, distanze e break point sono contenute nel file `variables.scss`.
Esistono altre variabili con scope ridotto che sono definite all'interno del singolo file che le utilizza.
Se una variabile ha scope maggiore di un file va spostata insieme alle altre variabili.

### CSS Lint
Le righe di codice _css_ sono messe in *ordine alfabetico*.

Esempio sbagliato:
```
.classe {
	margin: 1rem;
	border: solid 1px red;
	color: purple;
}
```

Esempio corretto:
```
.classe {
	border: solid 1px red;
	color: purple;
	margin: 1rem;
}
```

### Media queries
Le varaibili che definiscono i vari break points sono definte nel file `variables.scss`.
Queste variabili vengono richiamate all'interno del codice da funzioni ad hoc definite nel file `mixins.scss`.

Esempio:
```
@include fromTablet {
	[css code]
}
```

produrrà un codice _css_:
```
@media only screen and (min-width: $tablet-breakpoint) {
	[css code]
}
```
