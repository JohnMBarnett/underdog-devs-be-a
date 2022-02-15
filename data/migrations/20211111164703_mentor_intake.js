exports.up = function (knex) {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('mentor_intake', function (table) {
      table.increments('mentor_intake_id').notNullable().unique().primary();
      table
        .string('profile_id')
        .notNullable()
        .unsigned()
        .references('profile_id')
        .inTable('profiles')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT');
      table.string('email').notNullable();
      table.string('location').notNullable();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('current_comp');
      table.boolean('other_tech');
      table.boolean('front_end').defaultValue(false);
      table.boolean('back_end').defaultValue(false);
      table.boolean('full_stack').defaultValue(false);
      table.boolean('android_mobile').defaultValue(false);
      table.boolean('ios_mobile').defaultValue(false);
      table.string('experience_level').notNullable();
      table.string('mentor_commitment', 255).notNullable();
      table.string('other_info', 255);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('mentor_intake');
};
