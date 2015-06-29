/* This is for purpose only, just for testing, because Mootools needs a real JSONP service, this can work just because we call a known function (NS_LiveDM.onComplete), but this isn't work with all the Mootools JSONP events (onComplete is never fired and you can't chain a request). */

NS_LiveDM.onComplete({
	"items" : [
		{
			"picture" : "http://media.rtl.fr/online/image/2013/0207/7757829561_les-salaries-de-petroplus-le-2-janvier-2012.jpg",
			"title" : "Petroplus : la société égyptienne renonce à son projet de reprise",
			"tag" : "social nord",
			"time" : "13h04"
		},
		{
			"picture" : "http://media.rtl.fr/online/image/2011/0915/7718444023_des-taxis.jpg",
			"title" : "Trafic : nouveaux bouchons à prévoir sur les routes des stations de ski samedi",
			"tag" : "auto",
			"time" : "10h58"
		},
		{
			"picture" : "http://media.rtl.fr/online/image/2013/0308/7759253545_leonide-kameneff-avait-lance-ce-projet-de-voiliers-ecole-en-1969.jpg",
			"title" : "Une victime de \"L'Ecole en bateau\" : \"J'avais l'impression d'être un objet\"",
			"tag" : "justice",
			"time" : "15h41"
		},
		{
			"picture" : "http://media.rtl.fr/online/image/2012/0319/7745663195_najat-vallaud-belkacem-porte-parole-de-francois-hollande.jpg",
			"title" : "Inégalités salariales : Najat Vallaud-Belkacem promet des sanctions",
			"tag" : "politique",
			"time" : "08h25"
		},
		{
			"picture" : "http://media.rtl.fr/online/image/2012/0605/7749083161_justin-bieber-dans-son-clip-boyfriend.jpg",
			"title" : "Justin Bieber fait un malaise en plein concert",
			"tag" : "people",
			"time" : "02h18"
		},
		{
			"picture" : "http://media.rtl.fr/online/image/2013/0308/7759252477_des-soldats-francais-patrouillent-le-4-fevrier-2013-dans-la-ville-malienne-de-gao.jpg",
			"title" : "Un djihadiste présumé bientôt extradé du Mali vers la France",
			"tag" : "international",
			"time" : "18h05"
		},
		{
			"picture" : "http://media.rtl.fr/online/image/2013/0215/7758229132_des-paquets-de-cigarettes.jpeg",
			"title" : "Bientôt plus de limites d'achat de cigarettes à l'étranger ?",
			"tag" : "société",
			"time" : "22h58"
		},
		{
			"picture" : "http://media.rtl.fr/online/image/2013/0308/7759252119_karim-benzema-sous-le-maillot-des-merengue-du-real-madrid.jpg",
			"title" : "Qui sont les sportifs français les mieux payés en 2012 ?",
			"tag" : "football",
			"time" : "01h00"
		},
		{
			"picture" : "http://media.rtl.fr/online/image/2013/0305/7759124161_une-jeune-femme-a-reconnu-ses-violeurs-presumes-via-leurs-profils-facebook.jpg",
			"title" : "Facebook se relooke !",
			"tag" : "social",
			"time" : "20h32"
		},
		{
			"picture" : "http://media.rtl.fr/online/image/2012/1201/7755356039_neymar-avec-la-selection-du-bresil.jpg",
			"title" : "Neymar n'a \"pas de préférence\" entre Real et Barça",
			"tag" : "football mercato",
			"time" : "16h22"
		}
	],
	"show":
		{
			"video":true
		}
});