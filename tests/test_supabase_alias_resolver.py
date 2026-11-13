from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_alias_resolver_is_server_side_and_admin_only():
    source = (ROOT / "supabase/functions/resolve-lesson-alias/index.ts").read_text()
    config = (ROOT / "supabase/config.toml").read_text()
    assert "[functions.resolve-lesson-alias]" in config
    assert "verify_jwt = true" in config
    assert "SUPABASE_SERVICE_ROLE_KEY" in source
    assert "school_admins" in source
    assert '["owner", "editor"]' in source
    assert 'admin.rpc("resolve_lesson_uid_aliases"' in source
    assert "lesson_entitlements" not in source
    assert "access_behavior: \"resolve_only\"" in source


def test_admin_ui_uses_alias_resolver_without_replacing_legacy_catalog():
    source = (ROOT / "scripts/admin-management.js").read_text()
    assert 'functions.invoke("resolve-lesson-alias"' in source
    assert 'from("lesson_catalog")' in source
    assert 'from("lesson_content")' in source
    assert "legacy_id" in source and "localized_url" in source


def test_lesson_reader_progress_remains_on_legacy_storage_until_uid_mapping_is_approved():
    source = (ROOT / "scripts/lesson-reader.js").read_text()
    assert 'const storageKey="dch-reader:"+lesson.id' in source
    assert "localStorage.setItem(storageKey" in source
