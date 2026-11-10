import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class AuthenticationLocaleParityTests(unittest.TestCase):
    def test_sign_in_page_has_three_language_controls_and_no_duplicate_client_bootstrap(self):
        page = (ROOT / "auth/index.html").read_text(encoding="utf-8")
        self.assertEqual(page.count('data-lang="ru"'), 1)
        self.assertEqual(page.count('data-lang="en"'), 1)
        self.assertEqual(page.count('data-lang="zh"'), 1)
        self.assertEqual(page.count('scripts/supabase-config.js'), 1)
        self.assertIn('id="auth-theme"', page)
        self.assertIn('id="auth-form"', page)

    def test_sign_in_script_uses_all_locales_and_preserves_locale_in_callback(self):
        script = (ROOT / "scripts/auth.js").read_text(encoding="utf-8")
        for locale in ("ru:", "en:", "zh:"):
            self.assertIn(locale, script)
        self.assertIn('get("lang")', script)
        self.assertIn('localStorage.setItem("dch-language",lang)', script)
        self.assertIn('callback.html",location.href).href+"?lang="+lang', script)
        self.assertIn('registrationEnabled!==true', script)

    def test_account_page_and_profile_script_are_localized(self):
        page = (ROOT / "account/index.html").read_text(encoding="utf-8")
        script = (ROOT / "scripts/account.js").read_text(encoding="utf-8")
        for locale in ('data-lang="ru"', 'data-lang="en"', 'data-lang="zh"'):
            self.assertIn(locale, page)
        for key in ('title', 'lead', 'profile', 'notConfigured', 'signInRequired', 'confirmed', 'unconfirmed', 'logout'):
            self.assertIn(f'"{key}"', script)
        self.assertIn('localStorage.setItem("dch-language",lang)', script)
        self.assertIn('sb.auth.getSession()', script)
        self.assertIn('sb.auth.signOut()', script)

    def test_callback_localizes_confirmation_and_password_recovery(self):
        page = (ROOT / "auth/callback.html").read_text(encoding="utf-8")
        script = (ROOT / "scripts/auth-callback.js").read_text(encoding="utf-8")
        for locale in ('data-lang="ru"', 'data-lang="en"', 'data-lang="zh"'):
            self.assertIn(locale, page)
        for locale in ("ru:", "en:", "zh:"):
            self.assertIn(locale, script)
        for key in ("verifyOtp", "getSession", "updateUser", "signOut"):
            self.assertIn(key, script)
        self.assertIn('url.searchParams.set("lang"', script)

    def test_auth_presentation_supports_both_themes_and_mobile_layout(self):
        auth_css = (ROOT / "styles/auth.css").read_text(encoding="utf-8")
        account_css = (ROOT / "styles/account.css").read_text(encoding="utf-8")
        self.assertIn("html[data-theme=light]", auth_css)
        self.assertIn("html[data-theme=light]", account_css)
        self.assertIn("@media(max-width:520px)", auth_css)
        self.assertIn("@media(max-width:520px)", account_css)
        self.assertIn(":focus-visible", account_css)

    def test_public_registration_remains_disabled_and_no_auth_schema_is_changed(self):
        config = (ROOT / "scripts/supabase-config.js").read_text(encoding="utf-8")
        self.assertIn("registrationEnabled: false", config)
        self.assertNotIn("service_role", config)
        self.assertTrue((ROOT / "supabase/migrations/004_school_admin_roles.sql").is_file())

if __name__ == "__main__":
    unittest.main()
