# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)
    name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()
    first_name = models.CharField(max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    action_flag = models.PositiveSmallIntegerField()

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class FinalResultWt1HrdeipWs285AllWithIdtype(models.Model):
    input_id = models.TextField(blank=True, null=False, primary_key=True)
    ref_id = models.TextField(blank=True, null=True)
    wormbase_id = models.TextField(db_column='WormBase_ID', blank=True, null=True)  # Field name made lowercase.
    type = models.TextField(blank=True, null=True)
    init_pos = models.IntegerField(blank=True, null=True)
    end_pos = models.IntegerField(blank=True, null=True)
    read_count = models.IntegerField(blank=True, null=True)
    field_ofanswers = models.IntegerField(db_column='#ofanswers', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it started with '_'.
    evenly_rc = models.FloatField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'final_result_WT1_HRDEIP_WS285_all_with_id'


class Hw1Improve(models.Model):
    gene_id = models.TextField(db_column='Gene_ID', primary_key=True, blank=True)  # Field name made lowercase.
    transcript_id = models.TextField(db_column='transcript_ID', blank=True, null=True)  # Field name made lowercase.
    numbers = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hw1_improve'


class TranscriptWbidType(models.Model):
    field1 = models.IntegerField(blank=True, null=True)
    transcript = models.TextField(blank=True,  primary_key =True)
    wormbase_id = models.TextField(db_column='Wormbase_id', blank=True,null = True)  # Field name made lowercase.
    type = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'transcript_wbid_type'


class User(models.Model):
    user_id = models.CharField(primary_key=True, blank=True,max_length = 100)
    user_pass = models.CharField(blank=True, null=True,max_length =100)
    user_content = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user'


class Wormbase285(models.Model):
    geneid = models.TextField(db_column='GeneID', primary_key=True)  # Field name made lowercase.
    status = models.TextField(blank=True, null=True)
    sequence = models.TextField(blank=True, null=True)
    genename = models.TextField(db_column='GeneName', blank=True, null=True)  # Field name made lowercase.
    othername = models.TextField(db_column='OtherName', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'wormbase285'


class WormbaseGenetranscriptW285(models.Model):
    geneid = models.TextField(primary_key=True)
    status = models.TextField(blank=True, null=True)
    sequence = models.TextField(blank=True, null=True)
    genename = models.TextField(blank=True, null=True)
    othername = models.TextField(blank=True, null=True)
    transcript = models.TextField(blank=True, null=True)
    type = models.TextField(blank=True, null=True)
    transcript_count = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'wormbase_genetranscript W285'
