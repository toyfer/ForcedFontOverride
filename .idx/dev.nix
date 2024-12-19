# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.neovim
  ];

  # Sets environment variables in the workspace
  env = {
    VIMRUNTIME = "${pkgs.neovim}/share/nvim/runtime";
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = ["vscodevim.vim"];
  };
}
