Przyjęto tagowanie SHA, ponieważ pozwala na łatwe testowanie workflowa przez ręczne włączenie bez konieczności ustawiania nazwy wersji

Test CVE został wykonany za pomocą Trivy, ponieważ Docker Scout wymaga logowania do Dockera, co wymaga dodatkowych kluczy, które nie są wykorzysywane w wypychaniu obrazu.

Potrzebne są 2 sekrety: GH_TOKEN - token do autoryzacji wypchnięcia obrazu, GH_SSHKEY - klucz prywatny SSH do pobrania kodu źródłowego