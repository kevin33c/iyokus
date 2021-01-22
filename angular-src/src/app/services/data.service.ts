import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { Subcategory } from '../models/subcategory';
import { Regions } from '../models/regions';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject(undefined);
  currentMessage = this.messageSource.asObservable();

  constructor() { };

  //data sharing between components
  changeMessage(message: any) {
    this.messageSource.next(message)
  }

  getRegions() {
    return [
      new Regions('AB','Aberdeen','Aberdeen'),
      new Regions('AL','St Albans','St Albans'),
      new Regions('B','Birmingham','Birmingham'),
      new Regions('BA','Bath','Bath'),
      new Regions('BB','Blackburn','Blackburn'),
      new Regions('BD','Bradford','Bradford'),
      new Regions('BH','Bournemouth','Bournemouth'),
      new Regions('BL','Bolton','Bolton'),
      new Regions('BN','Brighton','Brighton'),
      new Regions('BR','Bromley','Bromley'),
      new Regions('BS','Bristol','Bristol'),
      new Regions('BT','Belfast','Belfast'),
      new Regions('CA','Carlisle','Carlisle'),
      new Regions('CB','Cambridge','Cambridge'),
      new Regions('CF','Cardiff','Cardiff'),
      new Regions('CH','Chester','Chester'),
      new Regions('CM','Chelmsford','Chelmsford'),
      new Regions('CO','Colchester','Colchester'),
      new Regions('CR','Croydon','Croydon'),
      new Regions('CT','Canterbury','Canterbury'),
      new Regions('CV','Coventry','Coventry'),
      new Regions('CW','Crewe','Crewe'),
      new Regions('DA','Dartford','Dartford'),
      new Regions('DD','Dundee','Dundee'),
      new Regions('DE','Derby','Derby'),
      new Regions('DG','Dumfries','Dumfries'),
      new Regions('DH','Durham','Durham'),
      new Regions('DL','Darlington','Darlington'),
      new Regions('DN','Doncaster','Doncaster'),
      new Regions('DT','Dorchester','Dorchester'),
      new Regions('DY','Dudley','Dudley'),
      new Regions('E','East London','London'),
      //new Regions('EC','East Central London','London'),
      new Regions('EH','Edinburgh','Edinburgh'),
      new Regions('EN','Enfield','Enfield'),
      new Regions('EX','Exeter','Exeter'),
      new Regions('FK','Falkirk','Falkirk'),
      new Regions('FY','Blackpool','Blackpool'),
      new Regions('G','Glasgow','Glasgow'),
      new Regions('GL','Gloucester','Gloucester'),
      new Regions('GU','Guildford','Guildford'),
      new Regions('HA','Harrow','Harrow'),
      new Regions('HD','Huddersfield','Huddersfield'),
      new Regions('HG','Harrogate','Harrogate'),
      new Regions('HP','Hemel Hempstead','Hemel Hempstead'),
      new Regions('HR','Hereford','Hereford'),
      new Regions('HS','Outer Hebrides','Outer Hebrides'),
      new Regions('HU','Hull','Hull'),
      new Regions('HX','Halifax','Halifax'),
      new Regions('IG','Ilford','Ilford'),
      new Regions('IP','Ipswich','Ipswich'),
      new Regions('IV','Inverness','Inverness'),
      new Regions('KA','Kilmarnock','Kilmarnock'),
      new Regions('KT','Kingston upon Thames','Kingston'),
      new Regions('KW','Kirkwall','Kirkwall'),
      new Regions('KY','Kirkcaldy','Kirkcaldy'),
      new Regions('L','Liverpool','Liverpool'),
      new Regions('LA','Lancaster','Lancaster'),
      new Regions('LD','Llandrindod Wells','Llandrindod Wells'),
      new Regions('LE','Leicester','Leicester'),
      new Regions('LL','Llandudno','Llandudno'),
      new Regions('LN','Lincoln','Lincoln'),
      new Regions('LS','Leeds','Leeds'),
      new Regions('LU','Luton','Luton'),
      new Regions('M','Manchester','Manchester'),
      new Regions('ME','Rochester','Rochester'),
      new Regions('MK','Milton Keynes','Milton Keynes'),
      new Regions('ML','Motherwell','Motherwell'),
      //new Regions('N','North London','London'),
      new Regions('NE','Newcastle upon Tyne','Newcastle'),
      new Regions('NG','Nottingham','Nottingham'),
      new Regions('NN','Northampton','Northampton'),
      new Regions('NP','Newport','Newport'),
      new Regions('NR','Norwich','Norwich'),
      //new Regions('NW','North West London','London'),
      new Regions('OL','Oldham','Oldham'),
      new Regions('OX','Oxford','Oxford'),
      new Regions('PA','Paisley','Paisley'),
      new Regions('PE','Peterborough','Peterborough'),
      new Regions('PH','Perth','Perth'),
      new Regions('PL','Plymouth','Plymouth'),
      new Regions('PO','Portsmouth','Portsmouth'),
      new Regions('PR','Preston','Preston'),
      new Regions('RG','Reading','Reading'),
      new Regions('RH','Redhill','Redhill'),
      new Regions('RM','Romford','Romford'),
      new Regions('S','Sheffield','Sheffield'),
      new Regions('SA','Swansea','Swansea'),
      //new Regions('SE','South East London','London'),
      new Regions('SG','Stevenage','Stevenage'),
      new Regions('SK','Stockport','Stockport'),
      new Regions('SL','Slough','Slough'),
      new Regions('SM','Sutton','Sutton'),
      new Regions('SN','Swindon','Swindon'),
      new Regions('SO','Southampton','Southampton'),
      new Regions('SP','Salisbury','Salisbury'),
      new Regions('SR','Sunderland','Sunderland'),
      new Regions('SS','Southend-on-Sea','Southend-on-Sea'),
      new Regions('ST','Stoke-on-Trent','Stoke-on-Trent'),
      //new Regions('SW','South West London','London'),
      new Regions('SY','Shrewsbury','Shrewsbury'),
      new Regions('TA','Taunton','Taunton'),
      new Regions('TD','Galashiels','Galashiels'),
      new Regions('TF','Telford','Telford'),
      new Regions('TN','Tunbridge Wells','Tunbridge Wells'),
      new Regions('TQ','Torquay','Torquay'),
      new Regions('TR','Truro','Truro'),
      new Regions('TS','Cleveland','Cleveland'),
      new Regions('TW','Twickenham','Twickenham'),
      new Regions('UB','Southall','Southall'),
      //new Regions('W','West London','London'),
      new Regions('WA','Warrington','Warrington'),
      //new Regions('WC','Western Central London','London'),
      new Regions('WD','Watford','Watford'),
      new Regions('WF','Wakefield','Wakefield'),
      new Regions('WN','Wigan','Wigan'),
      new Regions('WR','Worcester','Worcester'),
      new Regions('WS','Walsall','Walsall'),
      new Regions('WV','Wolverhampton','Wolverhampton'),
      new Regions('YO','York','York'),
      new Regions('ZE','Lerwick','Lerwick'),
      new Regions('GY','Guernsey','Guernsey'),
      new Regions('JE','Jersey','Jersey'),
      new Regions('IM','Isle of Man','Isle of Man'),
    ];
  };

  getCategory() {
    return [
      new Category(100, 'Electronics', 'Electrónica'),
      new Category(200, 'Home', 'Hogar'),
      new Category(300, 'Fashion', 'Moda'),
      new Category(400, 'Sport', 'Deportes'),
      new Category(500, 'Leisure', 'Ocio'),
      new Category(600, 'Tools', ' Herramientas')
    ];
  };

  getSubcategory() {
    return [
      //electronics
      //new Subcategory(101, 100, 'Laptops', 'Laptops', 'Portátiles'),
      //new Subcategory(113, 100, 'Desktop PC', 'Desktop_PC', 'Sobremesas'),
      new Subcategory(102, 100, 'Phones & Accessories', 'Phones', 'Móviles'),
      //new Subcategory(103, 100, 'Tablets', 'Tablets', 'Tablets'),
      //new Subcategory(104, 100, 'Photography', 'Photography', 'Fotografía'),
      //new Subcategory(105, 100, 'TV & Home Cinema', 'TV_Home_Cinema', 'TV y Home Cinema'),
      new Subcategory(106, 100, 'Headphones & Audio', 'Headphone_Audio', 'Auriculares y Audio'),
      new Subcategory(115, 100, 'Bluetooth Speaker', 'Bluetooth_Speaker', 'ESP'),
      new Subcategory(116, 100, 'Headphone', 'Headphone', 'ESP'),


      new Subcategory(107, 100, 'Computer Accessories', 'Computer_Accessories', 'Accesorios de PC'),
      new Subcategory(108, 100, 'Eletronics Accessories', 'Eletronics_Accessories', 'Accesorios Electrónicos'),
      //new Subcategory(109, 100, 'Printers & Ink', 'Printer_Ink', 'Impresoras y Tinta'),
      //new Subcategory(110, 100, 'Videogames', 'Videogame', 'Videojuegos'),
      //new Subcategory(112, 100, 'Software', 'Software', 'Software'),
      new Subcategory(111, 100, 'Console & Accessories', 'Console_Accessories', 'Consolas y accesorios'),
      new Subcategory(199, 100, 'Others', 'Others_Electronics', 'Otros'),

      //home
      new Subcategory(201, 200, 'Kitchen & Dinning Room', 'Kitchen_Dining', 'Cocina y comedor'),
      new Subcategory(210, 200, 'Wall Decor', 'Wall_Decor', 'ESP'),
      new Subcategory(211, 200, 'Coffee Cup', 'Coffee_Cup', 'ESP'),
      new Subcategory(212, 200, 'Cocktail Mugs', 'Cocktail_Mugs', 'ESP'),
      new Subcategory(213, 200, 'Bottles', 'Bottles', 'ESP'),

      new Subcategory(202, 200, 'Bedroom', 'Bedroom', 'Dormitorio'),
      new Subcategory(203, 200, 'Living Room', 'Living', 'Salón'),

      new Subcategory(214, 200, 'Oil Diffuser', 'Oil_Diffuser', 'ESP'),
      new Subcategory(215, 200, 'Decorative Accessories', 'Decorative_Accessories', 'ESP'),
      new Subcategory(216, 200, 'Alarm Clock', 'Alarm_Clock', 'ESP'),



      new Subcategory(209, 200, 'Office', 'Office', 'Oficina'),
      //new Subcategory(204, 200, 'Bathroom', 'Bathroom', 'Baño'),
      //new Subcategory(205, 200, 'Home Appliances', 'Home_Appliances', 'Eletrodomésticos'),
      //new Subcategory(206, 200, 'Garden & Outdoors', 'Garden_Outdoors', 'Jardín'),
      new Subcategory(207, 200, 'Lighting', 'Lighting', 'Iluminación'),
      new Subcategory(208, 200, 'Pet Supplies & Accessories', 'Pet_Supplies', 'Suministros de Mascotas'),
      new Subcategory(299, 200, 'Others', 'Others_Home', 'Otros'),

      //fashion
      new Subcategory(303, 300, 'Sweatshirts', 'Sweatshirts', 'Camisetas y Camisas'),
      
      new Subcategory(304, 300, 'Dresses & Blouses', 'Dresses_Blouses', 'Vestidos y Blusas'),
      new Subcategory(305, 300, 'Jackets & Coats', 'Jackets_Coats', 'Chaquetas y Abrigos'),
      //new Subcategory(306, 300, 'Jeans & Trousers', 'Jeans_Trousers', 'Vaqueros y Pantalones'),
      new Subcategory(307, 300, 'Jumpers & Sweaters', 'Jumpers_Sweaters', 'Jerseys'),
      //new Subcategory(308, 300, 'Suits & Blazers', 'Suits_Blazers', 'Trajes y Chaquetas'),
      new Subcategory(309, 300, 'Shoes & Trainers', 'Shoes_Trainers', 'Zapatos y Tenis'),
      //new Subcategory(313, 300, 'Baby & Kids Clothing', 'Baby_Kids_Fashion', 'Ropa de bebés y niños'),
      //new Subcategory(310, 300, 'Sport', 'Sport', 'Deportes'),
      //new Subcategory(311, 300, 'Underwears', 'Underwears', 'Ropa Interior'),
      new Subcategory(315, 300, 'Purses & Wallets', 'Purses_Wallets', 'Bolsos & Carteras'),
      new Subcategory(317, 300, 'Bags & Backpacks', 'Bags_Backpacks', 'Mochilas'),
      new Subcategory(316, 300, 'Watches', 'Watches', 'Relojs'),
      new Subcategory(312, 300, 'Accesories', 'Accesories_Fashion', 'Accesorios'),
      //new Subcategory(313, 300, 'Kids & Baby Fashion', 'Kids_Baby_Fashion', 'Moda de Niños y Bebés'),
      //new Subcategory(314, 300, 'Kids & Baby Accesories', 'Kids_Baby_Accesories', 'Accesorios de Niños y Bebés'),
      new Subcategory(399, 300, 'Others', 'Others', 'Otros'),

      //sport
      //new Subcategory(401, 400, 'Outdoor Clothing', 'Sports_Outdoor_Clothing', 'Ropa de Deportes'),
      //new Subcategory(402, 400, 'Outdoor Shoes', 'Sports_Outdoor_Shoes', 'Zapatos de Deportes'),
      new Subcategory(403, 400, 'Fitness', 'Fitness', 'Fitness'),
      new Subcategory(404, 400, 'Cycling', 'Cycling', 'Ciclismo'),
      new Subcategory(415, 400, 'Cycling Clothing', 'Cycling_Clothing', 'Ropa de Ciclismo'),
      new Subcategory(405, 400, 'Running', 'Running', 'Running'),
      new Subcategory(414, 400, 'Yoga', 'Yoga', 'Yoga'),
      //new Subcategory(406, 400, 'Tennis & Padel', 'Tennis_Padel', 'Tenis y Pádel'),
      //new Subcategory(413, 400, 'Football', 'Football', 'Fútbol'),
      //new Subcategory(412, 400, 'Basketball', 'Basketball', 'Baloncesto'),
      //new Subcategory(407, 400, 'Golf', 'Golf', 'Golf'),
      //new Subcategory(408, 400, 'Gym Accessories', 'Gym_Accessories', 'Gimnasio'),
      //new Subcategory(409, 400, 'Winter Sports', 'Winter_Sports', 'Deportes de Invierno'),
      //new Subcategory(410, 400, 'Water Sports', 'Water_Sports', 'Deportes Acuáticos'),
      new Subcategory(411, 400, 'Accesories', 'Accesories_Sport', 'Accesorios'),
      //new Subcategory(499, 400, 'Others', 'Others', 'Otros'),

      //leisure
      new Subcategory(501, 500, 'Toys & Games', 'Toys_Games', 'Juguetes y Juegos'),
      new Subcategory(502, 500, '3D Models', '3D_Models', 'Modelismo'),
      //new Subcategory(512, 500, 'Boardgame', 'Boardgame', 'Juego de Mesa'),
      //new Subcategory(503, 500, 'Cinema, DVD, Blu-ray & Movies', 'Cinema_Movies', 'Cine, DVD, Blu-ray y Películas'),
      //new Subcategory(504, 500, 'Books, Magazines & Comics', 'Books_Magazines_Comics', 'Libros, Revistas y Cómics'),
      new Subcategory(505, 500, 'Travel', 'Travel', 'Viajes'),
      new Subcategory(510, 500, 'Music Instruments & Accesories', 'Music_Instruments', 'Instrumentos Musicales & Accesorios'),
      //new Subcategory(506, 500, 'Radio Control', 'Radio_Control', 'Radiocontrol'),
      //new Subcategory(507, 500, 'Events & Entrances', 'Events_Entrances', 'Eventos y entradas'),
      new Subcategory(508, 500, 'Gifts', 'Gifts', 'Regalos'),
      new Subcategory(509, 500, 'Handmade', 'Handmade', 'Artesanías'),
      new Subcategory(511, 500, 'Costumes', 'Costumes', 'Disfraz'),
      //new Subcategory(599, 500, 'Others', 'Others', 'Otros'),


      //tools      
      new Subcategory(601, 600, 'Accessories and Parts for Car', 'Accessories_Car', 'Accesorios y Piezas para Coche'),
      //new Subcategory(602, 600, 'Accessories and Parts for Motorcycle', 'Accessories_Motorcycle', 'Accesorios y Piezas para Moto'),
      //new Subcategory(603, 600, 'Laboratory', 'Laboratory', 'Laboratorio'),
      new Subcategory(604, 600, 'Cleaning', 'Cleaning', 'Limpieza'),
      new Subcategory(605, 600, 'Security', 'Security', 'Seguridad'),
      new Subcategory(616, 600, 'Tools and Equipments', 'Tools_Equipments', 'Herramientas y Equipos')
    ];
  };
}