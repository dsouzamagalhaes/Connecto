-- Esse arquivo é documentação:
-- o banco de dados real é criado via javascript.

create table if not exists
  conta
( id integer primary key
, senha_hash blob not null
, email text not null
)

create table if not exists
  artista
( conta_id integer primary key references conta( id )
, nome text not null
, descricao text default "" not null
);

create table if not exists
  genero
( nome text primary key not null
) without rowid;

create table if not exists
  artista_genero
( artista_id integer primary key references artista( id ) not null
, genero_id text primary key references genero( nome ) not null
) without rowid;

create table if not exists
  organizador
( conta_id integer primary key references conta( id )
, nome text not null
, descricao text default "" not null
);

create table if not exists
  evento
( id integer primary key
, organizador_id integer primary key references organizador( id )
, descricao text not null
, lugar text not null
, data text not null
);

create table if not exists
  evento_artista
( evento_id integer primary key references evento( id ) not null
, artista_id integer primary key references artista( id ) not null
) without rowid;

insert into genero( nome ) values
  ('Rock')
, ('Funk')
, ('Trap')
, ('Pagode')
, ('Sertanejo')
;
